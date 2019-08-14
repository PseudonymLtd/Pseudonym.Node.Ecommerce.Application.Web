const fs = require('fs');
const express = require('express');
const logging = require('../util/logging');
const rendering = require('../util/rendering');

const router = express.Router();
const logger = new logging.Logger('Shop');

router.get('/', (request, response, next) =>
{
    fs.readFile('data/products.json', (err, data) => {
        if (err === null) {
            
            const products = JSON.parse(data.toString());
            logger.info(`Loaded ${products.length} product(s)`);
            
            rendering.render(response, 'shop', 'Shop', { products: products });

            return logger.debug('Request Ended');
        }
        throw err;
    });
});

module.exports = router;