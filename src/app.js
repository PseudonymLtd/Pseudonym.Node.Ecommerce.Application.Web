//require('bootstrap');

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const adminRoutes = require('./routes/admin');
const errorRoutes = require('./routes/error');
const shopRoutes = require('./routes/shop');
const logging = require('./util/logging');

const logger = new logging.Logger('Application');

app.set('view engine', 'ejs');
app.set('views', 'src/views');
app.set('resource-extensions', ['.css', '.ico', '.js'])

app.use((request, response, next) =>
{
    const isResource = app.get('resource-extensions').includes(path.extname(request.url).toLowerCase());
    if (isResource) {
        logger.debug(`Resource request: ${request.url}`);
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

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
app.use('/js', express.static(path.join(__dirname, '../node_modules/jquery/dist')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/admin', adminRoutes);
app.use('/shop', shopRoutes);
app.use(errorRoutes);

app.listen(3000);