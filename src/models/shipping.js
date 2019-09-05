const Framework = require('pseudonym.node.ecommerce.library.framework');

module.exports = class Shipping extends Framework.Models.DataModel
{
    constructor(id, name, window, price) {
        super(id);
        this.name = name;
        this.window = window;
        this.price = parseFloat(price);
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

    static Parse(dataObj) {
        return new Shipping(dataObj.id, dataObj.name, dataObj.window, dataObj.price);
    }
}