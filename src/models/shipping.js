const RenderableEntity = require('./renderableEntity');
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
                `<span><a href="/shop/product/${this.Id}">${this.Name}</a> - £${this.Price.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>` +
            `</div>` +
            `<div>` +
                `<span>${this.Window}</span>` +
            `</div>` +
        `</div>`).replace(/"/g, '\\"');
        console.log(render.html);
        return render
    }

    static Parse(dataObj) {
        return new Shipping(dataObj.id, dataObj.name, dataObj.window, dataObj.price);
    }
}