const DataModel = require('./dataModel')

module.exports = class Product extends DataModel
{
    constructor(id, name, description, price) {
        super(id);
        this.name = name;
        this.description = description;
        this.price = parseFloat(price);
    }
    
    get Name() {
        return this.name;
    }

    set Name(value) {
        return this.name = value;
    }

    get Description() {
        return this.description;
    }

    set Description(value) {
        return this.description = value;
    }

    get Price() {
        return this.price;
    }

    set Price(value) {
        return this.price = parseFloat(value);
    }

    static Parse(dataObj) {
        const product = new Product(dataObj.id, dataObj.name, dataObj.description, dataObj.price);
        product.Id = parseInt(dataObj.id);
        return product;
    }
}