const render = (request, response, path, title, dataObj) =>
{
    if (dataObj === undefined || dataObj === null) {
        dataObj = {};
    }
    dataObj.docTitle = title;
    dataObj.localServerUrl = request.protocol + '://' + request.get('host');
    response.render(path, dataObj);
};

module.exports.render = render;