const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const apiRoutes = require('./routes');
const logging = require('./util/logging');
const serviceResponse = require('./models/serviceResponse');

const logger = new logging.Logger('Service');

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use((request, response, next) =>
{
    logger.debug(`Request Recieved: ${request.url}`);
    next();
});

app.use('/api', apiRoutes);

app.use((request, response, next) =>
{
    logger.warn(`404 Not found:\r\n${request.url}`);

    response.status(404);

    response.send(serviceResponse.NotFound());
});

app.listen(3001);