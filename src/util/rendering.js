const render = (response, path, title, dataObj) =>
{
    if (dataObj === undefined || dataObj === null) {
        dataObj = {};
    }
    dataObj.docTitle = title;
    response.render(path, dataObj);
};

module.exports.render = render;