module.exports = class OrderItem
{
    constructor(product, quantity) {
        this.product = product;
        this.quantity = parseInt(quantity);
    }

    get Product() {
        return this.product;
    }

    set Product(value) {
        return this.product = value;
    }

    get Quantity() {
        return this.quantity;
    }

    set Quantity(value) {
        return this.quantity = parseInt(value);
    }

    get Total() {
        return this.Product.Price * this.Quantity;
    }
}