const CartItem = require('../models/cartItem');

module.exports = class Cart
{
    constructor() {
        this.items = [];
    }

    get Items() {
        return this.items;
    }

    get TotalQuantity() {
        return this.IsEmpty ? 0 : this.items.map(p => p.Quantity).reduce((t, q) => t + q);
    }

    get SubTotal() {
        return this.IsEmpty ? 0 : this.items.map(p => p.Total).reduce((t, p) => t + p);
    }

    get IsEmpty() {
        return this.items.length === 0;
    }

    FindItem(productId) {
        return this.items.find(ci => ci.Product.Id == parseInt(productId));
    }

    AddItem(product, quantity) {
        const existingCartItem = this.FindItem(product.Id);
        let qty = quantity;

        if (existingCartItem) {
          existingCartItem.Quantity += qty;
          qty = existingCartItem.Quantity;
        }
        else {
            this.items.push(new CartItem(product, qty));
        }
    }

    RemoveItem(productId, quantity) {
        const existingCartItem = this.FindItem(productId);
        if (existingCartItem) {
            if (quantity) {
                existingCartItem.Quantity -= quantity;
                if (existingCartItem.Quantity <= 0) {
                    this.items.splice(this.items.indexOf(existingCartItem), 1);
                }
            }
            else {
                this.items.splice(this.items.indexOf(existingCartItem), 1);
            }
        }
    }
}