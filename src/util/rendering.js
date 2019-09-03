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
    dataObj.parseMoney = parseMoney;
    dataObj.principal = request.principal;

    response.render(path, dataObj);
    request.app.logger.debug('Page Served');
};

const parseMoney = (int) => {
    return int.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports.render = render;