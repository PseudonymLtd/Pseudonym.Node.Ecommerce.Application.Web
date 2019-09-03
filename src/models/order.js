module.exports = class Order
{
    constructor(items) {
        this.items = [...items];
        this.id = null;
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
}