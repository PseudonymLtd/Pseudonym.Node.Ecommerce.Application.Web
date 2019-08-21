const http = require('request');
const logging = require('../util/logging');
const rendering = require('../util/rendering');
const serviceDirectory = require('../util/serviceDirectory');
const Product = require('../models/product');

const logger = new logging.Logger('ProductsController');

module.exports.getAddProduct = (request, response, next) => {

    rendering.render(request, response, 'admin/add-product', 'Add Product');

    return logger.debug('Page Served');
};

module.exports.postAddProduct = (request, response, next) => {

    var newProduct = Product.Parse(request.body);

    http(`${serviceDirectory.ProductsServiceUrl}/api/product`, { json: true, body: newProduct, method: "PUT" }, (err, res, body) => {
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
            product: body.data
        });

        return logger.debug('Page Served');
    });
};


module.exports.postUpdateProduct = (request, response, next) => {

    var updatedProduct = Product.Parse(request.body);

    http(`${serviceDirectory.ProductsServiceUrl}/api/product/${updatedProduct.id}`, { json: true, body: updatedProduct, method: "PUT" }, (err, res, body) => {
        if (err) { return logger.fatal(err); }

        if (body.code !== 200) {
            logger.error(`External Error: ${body.message}`);
            return response.redirect(`/admin/update-product?success=false&error=${body.message}`)
        }

        logger.debug('update product result:');
        console.debug(body);

        //Check for item in cart
        const cart = request.app.get('cart');
        const existingItem = cart.FindItem(updatedProduct.Id);
        existingItem.Product.Price = updatedProduct.Price;

        return response.redirect(`/shop/product/${updatedProduct.Id}`);
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

        return response.redirect('/shop/products');
    });
};