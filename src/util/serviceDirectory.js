const Framework = require('library.ecommerce.framework');

module.exports.ProductsServiceClient = new Framework.Utils.HttpClient('http://localhost:3001');
module.exports.OrdersServiceClient = new Framework.Utils.HttpClient('http://localhost:3002');