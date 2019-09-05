const Framework = require('pseudonym.node.ecommerce.library.framework');
const rendering = require('../util/rendering');
const serviceDirectory = require('../util/serviceDirectory');
const Product = require('../models/product');

module.exports = class AdminController extends Framework.Service.Controller {
    constructor() {
        super('Admin Controller', ['Administrator']);

        this.Get('/add-product', (request, response, next) => {
            return rendering.render(request, response, 'admin/add-product', 'Add Product');
        });

        this.Post('/add-product', (request, response, next) => {
            var newProduct = Product.Parse(request.body);
        
            return serviceDirectory.ProductsServiceClient.Put('api/product', newProduct, (body) => {
                return response.redirect(`/shop/product/${body.data.id}`);
            }, next);
        });

        this.Get('/remove-product/:id', (request, response, next) => {
            return serviceDirectory.ProductsServiceClient.Delete(`api/product/${request.params.id}`, (body) => {
                //Check for item in cart
                const cart = request.cart;
                cart.RemoveItem(request.params.id)
        
                return response.redirect('/admin/manage-products');
            }, next);
        });

        this.Get('/update-product/:id', (request, response, next) => {
            return serviceDirectory.ProductsServiceClient.Get(`api/product/${request.params.id}`, (body) => {
                rendering.render(request, response, 'admin/update-product', 'Edit Product', {
                    product: Product.Parse(body.data),
                    sender: request.query.sender ? request.query.sender : 'Management'
                });
            }, next);
        });

        this.Post('/update-product/:id', (request, response, next) => {

            var updatedProduct = Product.Parse(request.body);
        
            return serviceDirectory.ProductsServiceClient.Put(`api/product/${updatedProduct.id}`, updatedProduct, (body) => {
                //Check for item in cart
                const cart = request.cart;
                const existingItem = cart.FindItem(body.data.id);
                if (existingItem) {
                    existingItem.Product.Price = body.data.price;
                }
        
                if (request.query.sender && request.query.sender === 'ProductDetails') {
                    return response.redirect(`/shop/product/${body.data.id}`);
                }
                else {
                    return response.redirect('/admin/manage-products');
                }
            }, next);
        });

        this.Get('/manage-products', (request, response, next) => {
            return serviceDirectory.ProductsServiceClient.Get('api/products', (body) => {
                let products = body.data.map(b => Product.Parse(b))
                this.Logger.info(`Loaded ${products.length} product(s)`);
        
                rendering.render(request, response, 'admin/manage-products', 'Manage Products', { products: products } );
              }, next);
        });
    }
}