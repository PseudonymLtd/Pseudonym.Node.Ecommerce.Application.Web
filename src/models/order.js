const RenderableEntity = require('./renderableEntity');
const OrderItem = require('./orderItem');
const Product = require('./product');
const Shipping = require('./shipping');
const money = require('../util/money');
const DropDownField = require('./form/dropdownField');
const DropDownFieldValue = require('./form/dropdownFieldValue');

const PendingState = 'Pending';
const AbandonedState = 'Abandoned';
const CancelledState = 'Cancelled';
const CompletedState = 'Completed';

module.exports = class Order extends RenderableEntity
{
    constructor(items) {
        super(null, 'Order', 'Orders');
        this.items = [...items];
    }

    get Items() {
        return this.items;
    }

    get SubTotal() {
        return this.IsEmpty ? 0 : this.items.map(p => p.Total).reduce((t, p) => t + p);
    }

    get VAT() {
        return this.SubTotal * (this.VatInfo.Rate / 100);
    }

    get Total() {
        return this.SubTotal + this.VAT + this.Shipping.Price;
    }

    get Shipping() {
        return this.shipping;
    }

    set Shipping(value) {
        return this.shipping = value;
    }

    get VatInfo() {
        return this.vatInfo;
    }

    set VatInfo(value) {
        return this.vatInfo = value;
    }

    get Status() {
        return this.status;
    }

    set Status(value) {
        return this.status = value;
    }

    get StatusStyle() {
        switch(this.Status) {
            case CompletedState:
                return 'color: green;';
            case AbandonedState:
                return 'color: red;';
            case CancelledState:
                return 'color: gray;';
            default:
                return 'color: orange;';
        }
    }

    Render() {
        const render = super.Render();
        render.html = `<strong>Order ID ${this.Id} <span style="${this.StatusStyle}">${this.Status}</span></strong>`;
        for (let item of this.Items) {
            render.html +=
            '<div class="row align-items-center justify-content-between">' +      
                '<div class="col align-self-center">' +
                    `<span>${item.Quantity} x <a href="/shop/product/${item.Product.Id}">${item.Product.Name}</a> @ £${money.Parse(item.Product.Price)}</span>` +
                '</div>' +
                '<div class="col align-self-center" style="text-align: right;">' +
                    `<span>£${money.Parse(item.Total)}</span>` +
                '</div>' +
            '</div>';
        }

        render.html +=
        '<div class="row align-items-center justify-content-between">' +      
            '<div class="col align-self-center">' +
                `<span>VAT (${this.VatInfo.Region}) @ ${this.VatInfo.Rate.toFixed(2)}%</span>` +
            '</div>' +
            '<div class="col align-self-center" style="text-align: right;">' +
                `<span>£${money.Parse(this.VAT)}</span>` +
            '</div>' +
        '</div>';

        render.html +=
        '<div class="row align-items-center justify-content-between">' +      
            '<div class="col align-self-center">' +
                `<span>Postage & Packaging - ${this.Shipping.Name}</span>` +
            '</div>' +
            '<div class="col align-self-center" style="text-align: right;">' +
                `<span>£${money.Parse(this.Shipping.Price)}</span>` +
            '</div>' +
        '</div>';

        render.html +=
        '<div class="row align-items-center justify-content-between">' +      
            '<div class="col align-self-center" style="text-align: right;">' +
                `<span><b>£${money.Parse(this.Total)}</b></span>` +
            '</div>' +
        '</div>';

        render.html = render.html.replace(/"/g, '\\"');
        return render;
    }

    static FormMetaData() {
        return [
            new DropDownField('Status', [
                new DropDownFieldValue(PendingState, PendingState),
                new DropDownFieldValue(CompletedState, CompletedState),
                new DropDownFieldValue(AbandonedState, AbandonedState),
                new DropDownFieldValue(CancelledState, CancelledState)
            ])
        ];
    }

    static Parse(dataObj) {
        const order = new Order(dataObj._items.map(i => new OrderItem(new Product(i._productId, i._productName, undefined, i._pricePerItem, undefined), i._quantity)));
        order.Shipping = new Shipping(dataObj._shipping._Id, dataObj._shipping._name, dataObj._shipping._window, dataObj._shipping._price);
        order.Status = dataObj._status;
        order.VatInfo = dataObj._vatInfo;
        order.Id = dataObj._id;
        return order;
    }
}