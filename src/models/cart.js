const OrderItem = require('./orderItem');

module.exports = class Cart
{
    constructor(items) {
        this.items = items === undefined ? [] : items;
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

    Reset() {
        this.items = [];
    }

    FindItem(productId) {
        return this.items.find(ci => ci.Product.Id == productId);
    }

    AddItem(product, quantity) {
        const existingOrderItem = this.FindItem(product.Id);
        let qty = quantity;

        if (existingOrderItem) {
          existingOrderItem.Quantity += qty;
          qty = existingOrderItem.Quantity;
        }
        else {
            this.items.push(new OrderItem(product, qty));
        }
    }

    RemoveItem(productId, quantity) {
        const existingOrderItem = this.FindItem(productId);
        if (existingOrderItem) {
            if (quantity) {
                existingOrderItem.Quantity -= quantity;
                if (existingOrderItem.Quantity <= 0) {
                    this.items.splice(this.items.indexOf(existingOrderItem), 1);
                }
            }
            else {
                this.items.splice(this.items.indexOf(existingOrderItem), 1);
            }
        }
    }
}