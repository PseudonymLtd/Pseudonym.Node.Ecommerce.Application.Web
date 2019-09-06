const RenderableEntity = require('./renderableEntity');
const OrderItem = require('./orderItem');
const Product = require('./product');
const Shipping = require('./shipping');
const money = require('../util/money');
const TextField = require('./form/textField');

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

    get Id() {
        return this.id;
    }

    set Id(value) {
        return this.id = parseInt(value);
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
        return this.SubTotal + this.VAT + this.PostalService.Price;
    }

    get PostalService() {
        return this.postalService;
    }

    set PostalService(value) {
        return this.postalService = value;
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
            case 'Completed':
                return 'color: green;';
            case 'Abandoned':
                return 'color: red;';
            case 'Cancelled':
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
                `<span>Postage & Packaging - ${this.PostalService.Name}</span>` +
            '</div>' +
            '<div class="col align-self-center" style="text-align: right;">' +
                `<span>£${money.Parse(this.PostalService.Price)}</span>` +
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
            new TextField('Status', `${PendingState} | ${CompletedState} | ${AbandonedState} | ${CancelledState}`, true)
        ];
    }

    static Parse(dataObj) {
        const order = new Order(dataObj.items.map(i => new OrderItem(new Product(i.productId, i.productName, undefined, i.pricePerItem, undefined), i.quantity)));
        order.PostalService = new Shipping(dataObj.postalService.Id, dataObj.postalService.Name, dataObj.postalService.Window, dataObj.postalService.Price);
        order.Status = dataObj.status;
        order.VatInfo = dataObj.vatInfo;
        order.Id = dataObj.id;
        return order;
    }
}