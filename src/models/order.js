module.exports = class Order
{
    constructor(items, vatInfo, postalService) {
        this.items = [...items];
        this.vatInfo = vatInfo;
        this.postalService = postalService;
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

    get PostalService() {
        return this.postalService;
    }

    get Total() {
        return this.SubTotal + this.VAT + this.PostalService.Price;
    }

    get VatInfo() {
        return this.vatInfo;
    }
}