const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const adminRoutes = require('./routes/admin');
const errorRoutes = require('./routes/error');
const shopRoutes = require('./routes/shop');
const logging = require('./util/logging');

const logger = new logging.Logger('Application');

const registerMiddleware = (section, middlewareFunc) => {
    if (section !== '') {
        logger.info(`Registering Middleware: ${section} Pages Processor`);
    }
    app.use(section, middlewareFunc);
};

app.set('view engine', 'ejs');
app.set('views', 'src/views');
app.set('resource-extensions', ['.css', '.ico'])

registerMiddleware('', (request, response, next) =>
{
    const isResource = app.get('resource-extensions').includes(path.extname(request.url).toLowerCase());
    if (isResource) {
        logger.debug(`Public resource requested: ${request.url}`);
    }
    else {
        logger.debug(`Request Started - requested uri: ${request.url}`);
    }
    next();
});

app.get('/', (request, response, next) =>
{
    return response.redirect('/shop');
});

registerMiddleware('', express.static(path.join(__dirname, 'public')));

registerMiddleware('', bodyParser.urlencoded({extended: false}));

registerMiddleware('', bodyParser.json());

registerMiddleware('/admin', adminRoutes);

registerMiddleware('/shop', shopRoutes);

registerMiddleware('', errorRoutes);

app.listen(3000);