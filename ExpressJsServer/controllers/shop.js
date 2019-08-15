const http = require('request');
const logging = require('../util/logging');
const rendering = require('../util/rendering');
const serviceDirectory = require('../util/serviceDirectory');

const logger = new logging.Logger('ShopController');

module.exports.getShop = (request, response, next) => {
  return http(`${serviceDirectory.ProductsServiceUrl}/api/products`, { json: true }, (err, res, body) => {
    if (err) { return logger.fatal(err); }

    if (body.code !== 200) {
      logger.error(`External Error: ${body.message}`);
      return response.redirect(`/shop?success=false&error=${body.message}`)
    }

    logger.info(`Loaded ${body.data.length} product(s)`);

    rendering.render(response, 'shop', 'Shop', { products: body.data });

    return logger.debug('Page Served');
  });
};