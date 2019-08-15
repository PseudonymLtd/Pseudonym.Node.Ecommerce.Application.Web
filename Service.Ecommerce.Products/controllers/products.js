const fs = require('fs');
const logging = require('../util/logging');
const serviceResponse = require('../models/serviceResponse');

const logger = new logging.Logger('ProductsController');

module.exports.getProducts = (request, response, next) => {
    fs.readFile('data/products.json', (err, data) => {
        if (err) { return logger.fatal(err); }

        var data = JSON.parse(data.toString());

        response.send(serviceResponse.Ok(data));

        return logger.debug('Data Returned');
    });
};

module.exports.putProduct = (request, response, next) => {
    fs.readFile('data/products.json', (err, data) => {
        if (err) { return logger.fatal(err); }

        const products = JSON.parse(data.toString());
        products.push(request.body);

        return fs.writeFile('data/products.json', JSON.stringify(products), (err) => {
            if (err) { return logger.fatal(err); }
            logger.info(`Added new product:`);
            console.info(request.body);
            
            return response.send(serviceResponse.Ok(undefined, {
                itemName: request.body.name,
                status: 'added'
            }));
        });
    });
};