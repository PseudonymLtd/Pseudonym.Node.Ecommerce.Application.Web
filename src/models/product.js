const Framework = require('pseudonym.node.ecommerce.library.framework');
const defaultImageUri = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4kBXV6VqdDEmldnFeTtLXnOrcF2A0oF_4THg5kyQt4D8Wgvmj';

module.exports = class Product extends Framework.Models.DataModel
{
    constructor(id, name, description, price, imageUri) {
        super(id);
        this.name = name;
        this.description = description;
        this.price = parseFloat(price);
        this.imageUri = imageUri === undefined || imageUri === null ? defaultImageUri : imageUri;
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

    get ImageUri() {
        return this.imageUri;
    }

    set ImageUri(value) {
        return this.imageUri = value;
    }

    static Parse(dataObj) {
        return new Product(dataObj.id, dataObj.name, dataObj.description, dataObj.price, dataObj.imageUri);
    }
}