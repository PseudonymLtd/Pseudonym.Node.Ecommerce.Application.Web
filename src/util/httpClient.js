const http = require('request');
const Logger = require('../util/logging');

const logger = new Logger('Http Client');

module.exports = class HttpClient
{
    constructor(baseAddress) {
        this.baseAddress = baseAddress;
    }

    get BaseAddress() {
        return this.baseAddress;
    }

    Get(requestUri, callback, next) {
        return http(`${this.baseAddress}/${requestUri}`, { json: true, method: 'GET' }, (err, res, body) => {
            return handleResponse(err, body, next, callback);
        });
    }

    Delete(requestUri, callback, next) {
        return http(`${this.baseAddress}/${requestUri}`, { json: true, method: 'DELETE' }, (err, res, body) => {
            return handleResponse(err, body, next, callback);
        });
    }

    Post(requestUri, payload, callback, next) {
        return http(`${this.baseAddress}/${requestUri}`, { json: true, method: 'POST', body: payload }, (err, res, body) => {
            return handleResponse(err, body, next, callback);
        });
    }

    Put(requestUri, payload, callback, next) {
        return http(`${this.baseAddress}/${requestUri}`, { json: true, method: 'PUT', body: payload }, (err, res, body) => {
            return handleResponse(err, body, next, callback);
        });
    }
}

const handleResponse = (err, body, next, callback) => {
    if (err) {
        return next(err)
    }
    else if (body.code !== 200 && body.code !== 202) {
        if (body.additionalInformation) {
            logger.warn('An error occured - with additional information:');
            console.warn(body.additionalInformation);
        }
        return next(JSON.stringify(body.data, null, 4));
    }
    else {
        return callback(body);
    }
}