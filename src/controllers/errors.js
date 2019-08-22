const Logger= require('../util/logging');
const rendering = require('../util/rendering');

const logger = new Logger('ErrorsController');

module.exports.get404 = (request, response, next) => {

    logger.warn(`404 - Page not found: ${request.url}`);

    response.status(404);

    rendering.render(request, response, '404', '404 Not Found', { requestedUri: request.url });
};

module.exports.get500 = (error, request, response, next) => {
    if (error !== null && error !== undefined) {
        logger.error(`500 Internal Server Error: ${request.url}`);
        console.error(error);

        response.status(500);

        rendering.render(request, response, '500', '500 Internal Server Error', { 
            requestedUri: request.url,
            error: error
        });
    }
    else {
        next();
    }
};