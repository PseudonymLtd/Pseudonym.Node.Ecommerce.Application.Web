const render = (request, response, path, title, dataObj) =>
{
    if (dataObj === undefined || dataObj === null) {
        dataObj = {};
    }
    dataObj.docTitle = title;
    dataObj.localServerUrl = request.protocol + '://' + request.get('host');
    dataObj.cart = request.app.get('cart');
    dataObj.parseMoney = parseMoney;

    response.render(path, dataObj);
};

const parseMoney = (int) => {
    return int.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports.render = render;