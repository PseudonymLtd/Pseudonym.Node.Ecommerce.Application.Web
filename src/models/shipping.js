const RenderableEntity = require('./renderableEntity');
const money = require('../util/money');
const NumberField = require('./form/numberField');
const TextField = require('./form/textField');

const defaultImageUri = 'https://www.stamps.com/assets/images/shipping/hidden-postage/hidden-postage-large.jpg';

module.exports = class Shipping extends RenderableEntity
{
    constructor(id, name, window, price, imageUri) {
        super(id, 'Shipping', 'Shipping');
        this.name = name;
        this.window = window;
        this.price = parseFloat(price);
        this.imageUri = imageUri === undefined || imageUri === null ? defaultImageUri : imageUri;
    }

    get Name() {
        return this.name;
    }

    get Window() {
        return this.window;
    }

    get Price() {
        return this.price;
    }

    get ImageUri() {
        return this.imageUri;
    }

    Render() {
        const render = super.Render();
        render.html = 
        (`<img src="${this.ImageUri}" class="img-fluid" alt="product image" style="width: 75px; height: 75px; margin-right: 8px; float: left;" />` +
        `<div>` +
            `<div>` +
                `<span><a href="/shop/product/${this.Id}">${this.Name}</a> - £${money.Parse(this.Price)}</span>` +
            `</div>` +
            `<div>` +
                `<span>${this.Window}</span>` +
            `</div>` +
        `</div>`).replace(/"/g, '\\"');
        return render
    }

    static FormMetaData() {
        return [
            new TextField('Name', 'Shipping Service Name', true),
            new TextField('Window', 'x - y Working Days', true),
            new NumberField('Price', '', true, (1).toFixed(2), 0.01),
            new TextField('ImageUri', 'http://', false, defaultImageUri)
        ];
    }

    static Parse(dataObj) {
        return new Shipping(
            dataObj.Id ? dataObj.Id : dataObj._id,
            dataObj.Name ? dataObj.Name : dataObj._name,
            dataObj.Window ? dataObj.Window : dataObj._window,
            dataObj.Price ? dataObj.Price : dataObj._price);
    }
}