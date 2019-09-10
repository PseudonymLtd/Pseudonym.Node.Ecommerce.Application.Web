const Framework = require('pseudonym.node.ecommerce.library.framework');
const rendering = require('../util/rendering');
const Product = require('../models/product');
const Shipping = require('../models/shipping');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');

module.exports = class ShopController extends Framework.Service.Controller {
    constructor() {
        super('Shop Controller');

        this.Get('/', (request, response, next) => {
            return rendering.render(request, response, 'shop', 'Shop');
        });

        this.Get('/products', (request, response, next) => {
            return request.ProductsServiceClient.Get('api/products', (body) => {

                //export dto to model
                let products = body.data.map(b => Product.Parse(b));
                this.logger.info(`Loaded ${products.length} product(s)`);

                //apply search critera
                if (request.query.Search && request.query.Search.trim() != '') {
                    products = products.filter(p => {
                        const words = (p.Name.trim() + ' ' + p.Description.trim()).toLowerCase().split(' ');
                        const searchTerms = request.query.Search.trim().toLowerCase().split(' ');

                        for (let term of searchTerms) {
                            if (words.includes(term)) { return true; }
                        }

                        return false;
                    })
                }

                //update cart objects
                syncCart(request, products);

                if (products.length === 1) {
                    response.redirect(`/shop/product/${products[0].Id}`);
                }
                else {
                    rendering.render(request, response, 'shop/product-list', 'Products', { products: products });
                }
            }, next);
        });

        this.Get('/product/:id', (request, response, next) => {
            return request.ProductsServiceClient.Get(`api/product/${request.params.id}`, (body) => {

                const cart = request.cart;
                const existingOrderItem = cart.FindItem(request.params.id);
                const product = Product.Parse(body.data);

                //update cart object
                if (existingOrderItem) {
                    existingOrderItem.Product = product;
                }

                rendering.render(request, response, 'shop/product-details', `Product Details`, {
                    quantityInCart: existingOrderItem ? existingOrderItem.Quantity : 0,
                    product: product
                });
            }, next);
        });

        this.Get('/cart', (request, response, next) => {
            if (request.cart.IsEmpty) {
                return rendering.render(request, response, 'shop/cart', 'Cart', {
                    postalServices: []
                });
            }

            return request.ProductsServiceClient.Post('api/products', request.cart.Items.map(ci => ci.Product.Id), (body) => {

                //update cart objects
                syncCart(request, body.data);

                if (body.code === 206) {
                    this.logger.warn('request for updated products from cart was only partially successful:');
                    console.warn(body.additionalInformation);
                }

                return request.ShippingServiceClient.Get('api/shipping', (body) => {
                    return rendering.render(request, response, 'shop/cart', 'Cart', {
                        postalServices: body.data.map(s => Shipping.Parse(s))
                    });
                }, next);

                
            }, next);
        });

        this.Get('/cart/product/:id', (request, response, next) => {
            const cart = request.cart;
            cart.RemoveItem(request.params.id);

            return request.ShippingServiceClient.Get('api/shipping', (body) => {
                return rendering.render(request, response, 'shop/cart', 'Cart', {
                    postalServices: body.data.map(s => Shipping.Parse(s))
                });
            }, next);
        });

        this.Post('/cart', (request, response, next) => {

            let qty = parseInt(request.body.quantity);
            const product = Product.Parse(request.body);

            const existingOrderItem = request.cart.FindItem(product.Id);
            if (existingOrderItem) {
                existingOrderItem.Quantity += qty;
                qty = existingOrderItem.Quantity;
            }
            else {
                request.cart.AddItem(product, qty);
            }

            return response.redirect(`/shop/product/${product.Id}`);
        });

        this.Post('/cart/product/:id', (request, response, next) => {

            const qty = parseInt(request.body.quantity);
            const existingOrderItem = request.cart.FindItem(request.params.id);
            if (existingOrderItem) {
                request.cart.RemoveItem(request.params.id, existingOrderItem.Quantity - qty);
            }

            return request.ShippingServiceClient.Get('api/shipping', (body) => {
                return rendering.render(request, response, 'shop/cart', 'Cart', {
                    postalServices: body.data.map(s => Shipping.Parse(s))
                });
            }, next);
        });

        this.Post('/checkout', (request, response, next) => {
            if (request.cart.IsEmpty) {
                response.redirect('/');
            }
            else {

                const postalServiceId = parseInt(request.body.postalServiceId);
                request.preferences.postalServiceId = postalServiceId;

                return request.OrdersServiceClient.Post('api/order', {
                    order: new Order(request.cart.Items),
                    postalServiceId: postalServiceId
                }, 
                (body) => {

                    const order = new Order(body.data.items.map(
                        i => new OrderItem(
                            new Product(i.productId, i.productName, null, i.pricePerItem, null),
                             i.quantity)));
                    order.Id = body.data.id;
                    order.VatInfo = body.data.vatInfo;
                    order.PostalService = body.data.postalService;

                    rendering.render(request, response, 'shop/checkout', 'Checkout', {
                        order: order
                    });
                }, next);
            }
        });

        this.Post('/pay/:id', (request, response, next) => {
            if (request.cart.IsEmpty) {
                response.redirect('/');
            }
            else {
                return request.OrdersServiceClient.Put(`api/order/${request.params.id}`, 
                { 
                    status: 'Completed'
                    //payment details
                }, 
                (body) => {
                    if (body.data.status === 'Completed') {
                        request.cart.Reset();

                        rendering.render(request, response, 'shop/order-successful', 'Order Complete', {
                            status: body.data.status,
                            postalServiceName: body.data.postalService.Name,
                            postalServiceWindow: body.data.postalService.Window
                        });
                    }
                    else {
                        rendering.render(request, response, 'shop/order-unsuccessful', 'Order Unsuccessful', {
                            status: body.data.status
                        });
                    }
                }, next);
            }
        });

        const syncCart = (request, products) => {
            const cart = request.cart;

            for (let item of cart.Items) {
                const product = products.find(p => p.id === item.Product.Id);
                if (product) {
                    item.Product = Product.Parse(product);
                }
                else {
                    cart.RemoveItem(item.Product.Id);
                }
            }
        }
    }
}