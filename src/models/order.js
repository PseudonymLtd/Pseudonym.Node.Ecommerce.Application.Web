const vatPercentage = 20.00;

module.exports = class Order
{
    constructor(items) {
        this.items = [...items];
    }

    get Items() {
        return this.items;
    }

    get SubTotal() {
        return this.IsEmpty ? 0 : this.items.map(p => p.Total).reduce((t, p) => t + p);
    }

    get VAT() {
        return this.SubTotal * (vatPercentage / 100);
    }

    get PostalService() {
        return this.postalService;
    }

    set PostalService(value) {
        return this.postalService = value;
    }

    get Total() {
        return this.SubTotal + this.VAT + this.postalService.Price;
    }

    get VatPercentage() {
        return vatPercentage;
    }
}