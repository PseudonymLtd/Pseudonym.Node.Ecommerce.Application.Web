const http = require('request');
const logging = require('../util/logging');
const rendering = require('../util/rendering');
const serviceDirectory = require('../util/serviceDirectory');

const logger = new logging.Logger('ProductsController');

module.exports.getAddProduct = (request, response, next) => {

    rendering.render(response, 'add-product', 'Add Product');

    return logger.debug('Page Served');
};

module.exports.postAddProduct = (request, response, next) => {
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