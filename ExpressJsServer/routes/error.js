const express = require('express');
const logging = require('../logging');

const router = express.Router();
const logger = new logging.Logger('Error');

router.use((request, response, next) =>
{
    logger.warn(`404 - Page not found:\r\n${request.url}`);

    response.status(404).render('404', {
        docTitle: '404 Not Found',
        requestedUri: request.url
    });
});

module.exports = router;