const http = require('request');
const Logger= require('../util/logging');
const rendering = require('../util/rendering');
const serviceDirectory = require('../util/serviceDirectory');
const Product = require('../models/product');

const logger = new Logger('ProductsController');

module.exports.getAddProduct = (request, response, next) => {
    return rendering.render(request, response, 'admin/add-product', 'Add Product');
};

module.exports.getManageProducts = (request, response, next) => {
    return http(`${serviceDirectory.ProductsServiceUrl}/api/products`, { json: true }, (err, res, body) => {
        if (err) { return logger.fatal(err); }
    
        if (body.code !== 200) {
          logger.error(`External Error: ${body.message}`);
          return response.redirect(`/shop/products?success=false&error=${body.message}`)
        }
    
        let products = body.data.map(b => Product.Parse(b))
        logger.info(`Loaded ${products.length} product(s)`);

        rendering.render(request, response, 'admin/manage-products', 'Manage Products', { products: products } );
      });
};

module.exports.postAddProduct = (request, response, next) => {

    var newProduct = Product.Parse(request.body);

    return http(`${serviceDirectory.ProductsServiceUrl}/api/product`, { json: true, body: newProduct, method: "PUT" }, (err, res, body) => {
        if (err) { return logger.fatal(err); }

        if (body.code !== 200) {
            logger.error(`External Error: ${body.message}`);
            return response.redirect(`/admin/add-product?success=false&error=${body.message}`)
        }

        logger.debug('add product result:');
        console.debug(body);

        return response.redirect(`/shop/product/${body.data.id}`);
    });
};

module.exports.getUpdateProduct = (request, response, next) => {
    return http(`${serviceDirectory.ProductsServiceUrl}/api/product/${request.params.id}`, { json: true }, (err, res, body) => {
        if (err) { return logger.fatal(err); }

        if (body.code !== 200) {
            logger.error(`External Error: ${body.message}`);
            return response.redirect(`/shop/products?success=false&error=${body.message}`);
        }

        rendering.render(request, response, 'admin/update-product', 'Edit Product', {
            product: Product.Parse(body.data),
            sender: request.query.sender ? request.query.sender : 'Management'
        });
    });
};


module.exports.postUpdateProduct = (request, response, next) => {

    var updatedProduct = Product.Parse(request.body);

    return http(`${serviceDirectory.ProductsServiceUrl}/api/product/${updatedProduct.id}`, { json: true, body: updatedProduct, method: "PUT" }, (err, res, body) => {
        if (err) { return logger.fatal(err); }

        if (body.code !== 200) {
            logger.error(`External Error: ${body.message}`);
            return response.redirect(`/admin/update-product?success=false&error=${body.message}`)
        }

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
    });
};

module.exports.getRemoveProduct = (request, response, next) => {
    http(`${serviceDirectory.ProductsServiceUrl}/api/product/${request.params.id}`, { json: true, method: "DELETE" }, (err, res, body) => {
        if (err) { return logger.fatal(err); }

        if (body.code !== 200 && body.code !== 202) {
            logger.error(`External Error: ${body.message}`);
            return response.redirect(`/admin/remove-product?success=false&error=${body.message}`)
        }

        logger.debug('remove product result:');
        console.debug(body);

        //Check for item in cart
        const cart = request.app.get('cart');
        cart.RemoveItem(request.params.id)

        return response.redirect('/admin/manage-products');
    });
};