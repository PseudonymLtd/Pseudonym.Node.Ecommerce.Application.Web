const fs = require('fs');
const express = require('express');
const logging = require('../util/logging');
const rendering = require('../util/rendering');

const router = express.Router();
const logger = new logging.Logger('Admin');

router.get('/add-product', (request, response, next) => {

    rendering.render(response, 'add-product', 'Add Product');

    return logger.debug('Page Served');
});

router.post('/add-product', (request, response, next) => {
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
});

module.exports = router;