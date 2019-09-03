const Framework = require('library.ecommerce.framework');
const rendering = require('../util/rendering');
const serviceDirectory = require('../util/serviceDirectory');
const Product = require('../models/product');
const Order = require('../models/order');

module.exports = class ShopController extends Framework.Service.Controller {
    constructor() {
        super('Shop Controller');

        this.Get('/', (request, response, next) => {
            return rendering.render(request, response, 'shop', 'Shop');
        });

        this.Get('/products', (request, response, next) => {
            return serviceDirectory.ProductsServiceClient.Get('api/products', (body) => {

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
                syncCartItems(request, products);

                if (products.length === 1) {
                    response.redirect(`/shop/product/${products[0].Id}`);
                }
                else {
                    rendering.render(request, response, 'shop/product-list', 'Products', { products: products });
                }
            }, next);
        });

        this.Get('/product/:id', (request, response, next) => {
            return serviceDirectory.ProductsServiceClient.Get(`api/product/${request.params.id}`, (body) => {

                const cart = request.cart;
                const existingCartItem = cart.FindItem(request.params.id);
                const product = Product.Parse(body.data);

                //update cart object
                if (existingCartItem) {
                    existingCartItem.Product = product;
                }

                rendering.render(request, response, 'shop/product-details', `Product Details`, {
                    quantityInCart: existingCartItem ? existingCartItem.Quantity : 0,
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

            return serviceDirectory.ProductsServiceClient.Post('api/products', request.cart.Items.map(ci => ci.Product.Id), (body) => {

                //update cart objects
                syncCartItems(request, body.data);

                if (body.code === 206) {
                    this.logger.warn('request for updated products from cart was only partially successful:');
                    console.warn(body.additionalInformation);
                }

                return serviceDirectory.OrdersServiceClient.Get('api/shipping', (body) => {
                    return rendering.render(request, response, 'shop/cart', 'Cart', {
                        postalServices: body.data
                    });
                }, next);

                
            }, next);
        });

        this.Get('/cart/product/:id', (request, response, next) => {
            const cart = request.cart;
            cart.RemoveItem(request.params.id);

            return serviceDirectory.OrdersServiceClient.Get('api/shipping', (body) => {
                return rendering.render(request, response, 'shop/cart', 'Cart', {
                    postalServices: body.data
                });
            }, next);
        });

        this.Post('/cart', (request, response, next) => {

            let qty = parseInt(request.body.quantity);
            const product = Product.Parse(request.body);

            const existingCartItem = request.cart.FindItem(product.Id);
            if (existingCartItem) {
                existingCartItem.Quantity += qty;
                qty = existingCartItem.Quantity;
            }
            else {
                request.cart.AddItem(product, qty);
            }

            return response.redirect(`/shop/product/${product.Id}`);
        });

        this.Post('/cart/product/:id', (request, response, next) => {

            const qty = parseInt(request.body.quantity);
            const existingCartItem = request.cart.FindItem(request.params.id);
            if (existingCartItem) {
                request.cart.RemoveItem(request.params.id, existingCartItem.Quantity - qty);
            }

            return serviceDirectory.OrdersServiceClient.Get('api/shipping', (body) => {
                return rendering.render(request, response, 'shop/cart', 'Cart', {
                    postalServices: body.data
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
                return serviceDirectory.OrdersServiceClient.Get('api/shipping', (body) => {

                    const postalService = body.data.find(ps => ps.Id === postalServiceId);

                    return serviceDirectory.OrdersServiceClient.Get('api/vat', (body) => {

                        const order = new Order(request.cart.Items, body.data[0], postalService); //TODO: update array to use locales
    
                        rendering.render(request, response, 'shop/checkout', 'Checkout', {
                            order: order
                        });
                      }, next);

                }, next);
                
            }
        });

        this.Post('/pay', (request, response, next) => {
            if (request.cart.IsEmpty) {
                response.redirect('/');
            }
            else {
                return serviceDirectory.OrdersServiceClient.Get('api/shipping', (body) => {

                    const postalService = body.data.find(ps => ps.Id === parseInt(request.body.postalServiceId));

                    return serviceDirectory.OrdersServiceClient.Get('api/vat', (body) => {

                        const order = new Order(request.cart.Items, body.data[0], postalService); //TODO: update array to use locales
    
                        request.cart.Reset();

                        rendering.render(request, response, 'shop/order-successful', 'Order Complete', {
                            order: order
                        });
                      }, next);

                }, next);
            }
        });

        const syncCartItems = (request, products) => {
            const cart = request.cart;

            for (let cartItem of cart.Items) {
                const product = products.find(p => p.id === cartItem.Product.Id);
                if (product) {
                    cartItem.Product = Product.Parse(product);
                }
                else {
                    cart.RemoveItem(cartItem.Product.Id);
                }
            }
        }
    }
}