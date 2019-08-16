const http = require('request');
const logging = require('../util/logging');
const rendering = require('../util/rendering');
const serviceDirectory = require('../util/serviceDirectory');

const logger = new logging.Logger('ProductsController');

module.exports.getAddProduct = (request, response, next) => {

    const isInvalid = request.query.hasOwnProperty('invalidForm');

    rendering.render(request, response, 'add-product', 'Add Product', {
        invalidForm: isInvalid ? request.query.invalidForm : undefined
    });

    return logger.debug('Page Served');
};

module.exports.postAddProduct = (request, response, next) => {

    request.body.price = parseFloat(request.body.price);

    if (request.body.name.length === 0) {
        return response.redirect('/admin/add-product?invalidForm=emptyName');
    }
    else if (request.body.description.length === 0) {
        return response.redirect('/admin/add-product?invalidForm=emptyDesc');
    }

    http(`${serviceDirectory.ProductsServiceUrl}/api/product`, { json: true, body: request.body, method: "PUT" }, (err, res, body) => {
        if (err) { return logger.fatal(err); }

        if (body.code !== 200) {
            logger.error(`External Error: ${body.message}`);
            return response.redirect(`/add-product?success=false&error=${body.message}`)
        }

        logger.debug('add product result:');
        console.debug(body);

        return response.redirect('/');
    });
};

module.exports.getRemoveProduct = (request, response, next) => {
    http(`${serviceDirectory.ProductsServiceUrl}/api/product/${request.params.id}`, { json: true, method: "DELETE" }, (err, res, body) => {
        if (err) { return logger.fatal(err); }

        if (body.code !== 200 && body.code !== 202) {
            logger.error(`External Error: ${body.message}`);
            return response.redirect(`/remove-product?success=false&error=${body.message}`)
        }

        logger.debug('remove product result:');
        console.debug(body);

        return response.redirect('/');
    });
};