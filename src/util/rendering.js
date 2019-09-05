const money = require('./money');

const render = (request, response, path, title, dataObj) =>
{
    if (dataObj === undefined || dataObj === null) {
        dataObj = {};
    }
    dataObj.docTitle = title;
    dataObj.localServerUrl = `${request.protocol}://${request.get('host')}`;
    dataObj.requestedUri = request.Uri;
    dataObj.cart = request.cart;
    dataObj.preferences = request.preferences;
    dataObj.parseMoney = money.Parse;
    dataObj.principal = request.session.principal;

    response.render(path, dataObj);
    request.app.logger.debug('Page Served');
};

module.exports.render = render;