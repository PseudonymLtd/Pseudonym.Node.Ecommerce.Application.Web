const http = require('request');
const logging = require('../util/logging');
const rendering = require('../util/rendering');
const serviceDirectory = require('../util/serviceDirectory');

const logger = new logging.Logger('ProductsController');

module.exports.getAddProduct = (request, response, next) => {

    rendering.render(request, response, 'add-product', 'Add Product');

    return logger.debug('Page Served');
};

module.exports.postAddProduct = (request, response, next) => {

    request.body.price = parseFloat(request.body.price);

    http(`${serviceDirectory.ProductsServiceUrl}/api/product`, { json: true, body: request.body, method: "PUT" }, (err, res, body) => {
        if (err) { return logger.fatal(err); }

        if (body.code !== 200) {
            logger.error(`External Error: ${body.message}`);
            return response.redirect(`/admin/add-product?success=false&error=${body.message}`)
        }

        logger.debug('add product result:');
        console.debug(body);

        return response.redirect('/');
    });
};

module.exports.getUpdateProduct = (request, response, next) => {

    return http(`${serviceDirectory.ProductsServiceUrl}/api/product/${request.params.id}`, { json: true }, (err, res, body) => {
        if (err) { return logger.fatal(err); }
    
        if (body.code !== 200) {
          logger.error(`External Error: ${body.message}`);
          return response.redirect(`/shop?success=false&error=${body.message}`);
        }
    
        rendering.render(request, response, 'update-product', 'Edit Product', {
            product: body.data
        });
    
        return logger.debug('Page Served');
      });
};


module.exports.postUpdateProduct = (request, response, next) => {

    request.body.price = parseFloat(request.body.price);

    http(`${serviceDirectory.ProductsServiceUrl}/api/product/${request.body.id}`, { json: true, body: request.body, method: "PUT" }, (err, res, body) => {
        if (err) { return logger.fatal(err); }

        if (body.code !== 200) {
            logger.error(`External Error: ${body.message}`);
            return response.redirect(`/admin/update-product?success=false&error=${body.message}`)
        }

        logger.debug('update product result:');
        console.debug(body);

        return response.redirect(`/shop/product/${request.body.id}`);
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

        return response.redirect('/');
    });
};