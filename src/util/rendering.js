const money = require('./money');

const render = (request, response, path, title, dataObj) =>
{
    if (dataObj === undefined || dataObj === null) {
        dataObj = {};
    }
    dataObj.docTitle = title;
    dataObj.localServerUrl = `${request.protocol}://${request.get('host')}`;
    dataObj.requestedUri = request.Uri;
    dataObj.relativeUri = request.url;
    dataObj.cart = request.cart;
    dataObj.preferences = request.preferences;
    dataObj.parseMoney = money.Parse;
    dataObj.principal = request.session.principal;

    response.render(path, dataObj);
    request.Environment.Logger.Debug('Page Served');
};

const renderForm = (request, response, path, title, formMetaData, backbuttonUri, instance) => {
    let form = '';
    
    for (let field of formMetaData) {
        form += field.Render(instance);
    }

    return render(request, response, path, title, 
        { 
            form: form.replace(/"/g, '\\"'),
            backbuttonUri: backbuttonUri,
            entityId: instance ? instance.Id : 0
        });
}

module.exports.render = render;
module.exports.renderForm = renderForm;