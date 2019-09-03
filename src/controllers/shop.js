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

            const cart = request.cart;

            if (cart.IsEmpty) {
                return rendering.render(request, response, 'shop/cart', `Cart`, {
                    preferredPostalService: request.app.get('selected-postal-service')
                });
            }

            return serviceDirectory.ProductsServiceClient.Post('api/products', cart.Items.map(ci => ci.Product.Id), (body) => {

                //update cart objects
                syncCartItems(request, body.data);

                if (body.code === 206) {
                    this.logger.warn('request for updated products from cart was only partially successful:');
                    console.warn(body.additionalInformation);
                }

                return rendering.render(request, response, 'shop/cart', `Cart`, {
                    preferredPostalService: request.app.get('selected-postal-service')
                });
            }, next);
        });

        this.Get('/cart/product/:id', (request, response, next) => {
            const cart = request.cart;
            cart.RemoveItem(request.params.id);

            return rendering.render(request, response, 'shop/cart', `Cart`);
        });

        this.Post('/cart', (request, response, next) => {

            let qty = parseInt(request.body.quantity);
            const product = Product.Parse(request.body);
            const cart = request.cart;

            const existingCartItem = cart.FindItem(product.Id);
            if (existingCartItem) {
                existingCartItem.Quantity += qty;
                qty = existingCartItem.Quantity;
            }
            else {
                cart.AddItem(product, qty);
            }

            return response.redirect(`/shop/product/${product.Id}`);
        });

        this.Post('/cart/product/:id', (request, response, next) => {

            const qty = parseInt(request.body.quantity);
            const cart = request.cart;
            const existingCartItem = cart.FindItem(request.params.id);
            if (existingCartItem) {
                cart.RemoveItem(request.params.id, existingCartItem.Quantity - qty);
            }

            return rendering.render(request, response, 'shop/cart', `Cart`);
        });

        this.Post('/checkout', (request, response, next) => {
            const cart = request.cart;
            if (cart.IsEmpty) {
                response.redirect('/');
            }
            else {
                const postalServices = request.app.get('postal-services');
                const order = new Order(cart.Items);
                const postalServiceId = parseInt(request.body.postalServiceId);
                order.PostalService = postalServices.find(ps => ps.Id === postalServiceId);
                request.app.set('selected-postal-service', postalServiceId);

                rendering.render(request, response, 'shop/checkout', 'Checkout', {
                    order: order
                });
            }
        });

        this.Post('/pay', (request, response, next) => {
            if (request.cart.IsEmpty) {
                response.redirect('/');
            }
            else {
                const postalServices = request.app.get('postal-services');
                const order = new Order(request.cart.Items);
                const postalServiceId = parseInt(request.body.postalServiceId);
                order.PostalService = postalServices.find(ps => ps.Id === postalServiceId);

                return serviceDirectory.OrdersServiceClient.Put('api/order', order, (body) => {
                    request.cart.Reset();

                    rendering.render(request, response, 'shop/order-successful', 'Order Complete', {
                        order: order
                    });
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