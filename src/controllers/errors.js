const logging = require('../util/logging');
const rendering = require('../util/rendering');

const logger = new logging.Logger('ErrorsController');

module.exports.get404 = (request, response, next) => {

    logger.warn(`404 - Page not found: ${request.url}`);

    response.status(404);

    rendering.render(request, response, '404', '404 Not Found', { requestedUri: request.url });
};