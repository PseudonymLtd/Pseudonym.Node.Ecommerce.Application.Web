const logging = require('../util/logging');
const serviceResponse = require('../models/serviceResponse');
const dataStore = require('../data/dataStore');

const logger = new logging.Logger('ProductsController');

module.exports.getProducts = (request, response, next) => {
    dataStore.read((data) => {

        response.send(serviceResponse.Ok(data));

        return logger.debug('Data Returned');
    });
};

module.exports.putProduct = (request, response, next) => {
    dataStore.read((data) =>
    {
        const newId = data.length > 0 
                        ? data.sort((a, b) => a.id > b.id)[data.length - 1].id + 1 
                        : 1;

        let newItem = request.body;
        newItem.id = newId;

        data.push(newItem);

        dataStore.write(data, (data) => {
            logger.info(`Added new product:`);
            console.info(newItem);
    
            return response.send(serviceResponse.Ok(undefined, {
                itemName: newItem.name,
                identifier: newItem.id
            }));
        });
    });
};