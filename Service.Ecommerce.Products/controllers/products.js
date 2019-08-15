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

module.exports.getProduct = (request, response, next) => {
    dataStore.read((data) => {

        var id = parseInt(request.params.id);
        const record = data.find((r) => r.id === id );

        if (record !== undefined) {
            response.send(serviceResponse.Ok(record));
        }
        else {
            response.send(serviceResponse.InternalServerError({
                error: `No record found with Id ${id}.`
            }));
        }

        return logger.debug('Data Returned');
    });
};

module.exports.deleteProduct = (request, response, next) => {
    dataStore.read((data) =>
    {
        var id = parseInt(request.params.id);
        const record = data.find((r) => r.id == id );
        if (record !== undefined) {

            data.splice(data.indexOf(record), 1);

            dataStore.write(data, (_) => {
                logger.info(`removed product:`);
                console.info(record);
        
                return response.send(serviceResponse.Ok());
            });
        }
        else {
            response.send(serviceResponse.Partial(undefined, {
                UnexpectedBehaviour: `Record with Id ${request.params.id} has already been deleted, or never existed.`
            }));
        }
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

        dataStore.write(data, (_) => {
            logger.info(`Added new product:`);
            console.info(newItem);
    
            return response.send(serviceResponse.Ok(undefined, {
                itemName: newItem.name,
                identifier: newItem.id
            }));
        });
    });
};