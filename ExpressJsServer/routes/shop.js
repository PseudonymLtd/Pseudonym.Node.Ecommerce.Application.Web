const fs = require('fs');
const express = require('express');
const logging = require('../logging');

const router = express.Router();
const logger = new logging.Logger('Shop');

router.get('/', (request, response, next) =>
{
    fs.readFile('data/products.json', (err, data) => {
        if (err === null) {
            
            const products = JSON.parse(data.toString());
            logger.info(`Loaded ${products.length} product(s)`);
    
            response.render('shop', {
                docTitle: 'Shop',
                products: products,
                activeShop: true
            });

            return logger.debug('Request Ended');
        }
        throw err;
    });
});

module.exports = router;