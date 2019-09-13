const RenderableEntity = require('./renderableEntity');
const money = require('../util/money');
const NumberField = require('./form/numberField');
const TextField = require('./form/textField');

const defaultImageUri = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4kBXV6VqdDEmldnFeTtLXnOrcF2A0oF_4THg5kyQt4D8Wgvmj';

module.exports = class Product extends RenderableEntity
{
    constructor(id, name, description, price, imageUri) {
        super(id, 'Product', 'Products');
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

    Render() {
        const render = super.Render();
        render.html = 
        (`<img src="${this.ImageUri}" class="img-fluid" alt="product image" style="width: 75px; height: 75px; margin-right: 8px; float: left;" />` +
        `<div>` +
            `<div>` +
                `<span><a href="/shop/product/${this.Id}">${this.Name}</a> - £${money.Parse(this.Price)}</span>` +
            `</div>` +
            `<div>` +
                `<span>${this.Description}</span>` +
            `</div>` +
        `</div>`).replace(/"/g, '\\"');
        return render
    }

    static FormMetaData() {
        return [
            new TextField('Name', 'Product Name', true),
            new TextField('Description', 'Product Description', true),
            new NumberField('Price', '', true, (1).toFixed(2), 0.01),
            new TextField('ImageUri', 'http://', false, defaultImageUri)
        ];
    }

    static Parse(dataObj) {
        return new Product(
            dataObj.Id ? dataObj.Id : dataObj._id, 
            dataObj.Name ? dataObj.Name : dataObj._name,  
            dataObj.Description ? dataObj.Description : dataObj._description, 
            dataObj.Price ? dataObj.Price : dataObj._price,  
            dataObj.ImageUri ? dataObj.ImageUri : dataObj._imageUri);
    }
} 