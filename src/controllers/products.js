const http = require('request');
const Logger= require('../util/logging');
const rendering = require('../util/rendering');
const serviceDirectory = require('../util/serviceDirectory');
const HttpClient = require('../util/httpClient');
const Product = require('../models/product');

const logger = new Logger('ProductsController');
const httpClient = new HttpClient(serviceDirectory.ProductsServiceUrl);

module.exports.getAddProduct = (request, response, next) => {
    return rendering.render(request, response, 'admin/add-product', 'Add Product');
};

module.exports.getManageProducts = (request, response, next) => {
    return httpClient.Get('api/products', (body) => {
        let products = body.data.map(b => Product.Parse(b))
        logger.info(`Loaded ${products.length} product(s)`);

        rendering.render(request, response, 'admin/manage-products', 'Manage Products', { products: products } );
      }, next);
};

module.exports.postAddProduct = (request, response, next) => {

    var newProduct = Product.Parse(request.body);

    return httpClient.Put('api/product', newProduct, (body) => {
        logger.debug('add product result:');
        console.debug(body);

        return response.redirect(`/shop/product/${body.data.id}`);
    }, next);
};

module.exports.getUpdateProduct = (request, response, next) => {
    return httpClient.Get(`api/product/${request.params.id}`, (body) => {
        rendering.render(request, response, 'admin/update-product', 'Edit Product', {
            product: Product.Parse(body.data),
            sender: request.query.sender ? request.query.sender : 'Management'
        });
    }, next);
};

module.exports.postUpdateProduct = (request, response, next) => {

    var updatedProduct = Product.Parse(request.body);

    return httpClient.Put(`api/product/${updatedProduct.id}`, updatedProduct, (body) => {
        logger.debug('update product result:');
        console.debug(body);

        //Check for item in cart
        const cart = request.app.get('cart');
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
};

module.exports.getRemoveProduct = (request, response, next) => {
    return httpClient.Delete(`api/product/${request.params.id}`, (body) => {
        logger.debug('remove product result:');
        console.debug(body);

        //Check for item in cart
        const cart = request.app.get('cart');
        cart.RemoveItem(request.params.id)

        return response.redirect('/admin/manage-products');
    }, next);
};