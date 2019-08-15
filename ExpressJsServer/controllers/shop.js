const http = require('request');
const logging = require('../util/logging');
const rendering = require('../util/rendering');

const logger = new logging.Logger('ShopController');

module.exports.getShop = (request, response, next) => {
    return http(`${request.protocol}://${request.hostname}:${request.socket.localPort}/api/products`, { json: true }, (err, res, body) => {
        if (err) { return logger.fatal(err); }

        logger.info(`Loaded ${body.length} product(s)`);
                
        rendering.render(response, 'shop', 'Shop', { products: body });

        return logger.debug('Page Served');
      });
};