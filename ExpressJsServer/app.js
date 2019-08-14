const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const adminRoutes = require('./routes/admin');
const errorRoutes = require('./routes/error');
const shopRoutes = require('./routes/shop');
const logging = require('./logging');

const logger = new logging.Logger('Application');

const registerMiddleware = (section, middlewareFunc) => {
    if (section !== '') {
        logger.info(`Registering Middleware: ${section} Pages Processor`);
    }
    app.use(section, middlewareFunc);
};

app.set('view engine', 'ejs');

app.get('/', (request, response, next) =>
{
    return response.redirect('/shop');
});

registerMiddleware('', (request, response, next) =>
{
    logger.debug('Request Started');
    next();
});

registerMiddleware('', express.static(path.join(__dirname, 'public')));

registerMiddleware('', bodyParser.urlencoded({extended: false}));

registerMiddleware('/admin', adminRoutes);

registerMiddleware('/shop', shopRoutes);

registerMiddleware('', errorRoutes);

app.listen(3000);