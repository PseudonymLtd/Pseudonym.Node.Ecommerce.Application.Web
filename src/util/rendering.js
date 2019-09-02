const render = (request, response, path, title, dataObj) =>
{
    const logger = request.app.get('logger');

    if (dataObj === undefined || dataObj === null) {
        dataObj = {};
    }
    dataObj.docTitle = title;
    dataObj.localServerUrl = `${request.protocol}://${request.get('host')}`;
    dataObj.requestedUri = request.Uri;
    dataObj.cart = request.app.get('cart');
    dataObj.postalServices = request.app.get('postal-services');
    dataObj.parseMoney = parseMoney;

    response.render(path, dataObj);
    logger.debug('Page Served');
};

const parseMoney = (int) => {
    return int.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports.render = render;