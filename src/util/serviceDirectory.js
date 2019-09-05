const Framework = require('pseudonym.node.ecommerce.library.framework');

module.exports.ProductsServiceClient = new Framework.Utils.HttpClient('http://localhost:3001');
module.exports.OrdersServiceClient = new Framework.Utils.HttpClient('http://localhost:3002');
module.exports.ShippingServiceClient = new Framework.Utils.HttpClient('http://localhost:3003');