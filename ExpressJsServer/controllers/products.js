const fs = require('fs');
const http = require('request');
const logging = require('../util/logging');
const rendering = require('../util/rendering');

const logger = new logging.Logger('ProductsController');

module.exports.getAddProduct = (request, response, next) => {

    rendering.render(response, 'add-product', 'Add Product');

    return logger.debug('Page Served');
};

module.exports.postAddProduct = (request, response, next) => {
    fs.readFile('data/products.json', (err, data) => {
        if (err === null) {

            const products = JSON.parse(data.toString());
            products.push(request.body);

            return fs.writeFile('data/products.json', JSON.stringify(products), (err) => {
                if (err === null) {
                    logger.info(`Added new object:`);
                    console.info(request.body);
                    return response.redirect('/');
                }
                throw err;
            });
        }
        throw err;
    });
};

module.exports.getProducts = (request, response, next) => {
    fs.readFile('data/products.json', (err, data) => {
        if (err) { return logger.fatal(err); }

        response.send(JSON.parse(data.toString()));

        return logger.debug('Data Returned');
    });
};