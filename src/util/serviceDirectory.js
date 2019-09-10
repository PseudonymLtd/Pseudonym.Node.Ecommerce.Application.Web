const Framework = require('pseudonym.node.ecommerce.library.framework');

module.exports = class ServiceDirectory {
    constructor(service) {
        this._productsServiceClient = new Framework.Utils.CompliantServiceHttpClient('http://localhost:3001', 'Products Service', service);
        this._ordersServiceClient = new Framework.Utils.CompliantServiceHttpClient('http://localhost:3002', 'Orders Service', service);
        this._shippingServiceClient = new Framework.Utils.CompliantServiceHttpClient('http://localhost:3003', 'Shipping Service', service);
    }

    get ProductsServiceClient() {
        return this._productsServiceClient;
    }

    get OrdersServiceClient() {
        return this._ordersServiceClient;
    }

    get ShippingServiceClient() {
        return this._shippingServiceClient;
    }
}