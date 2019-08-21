const http = require('request');
const logging = require('../util/logging');
const rendering = require('../util/rendering');
const serviceDirectory = require('../util/serviceDirectory');
const Product = require('../models/product');

const logger = new logging.Logger('ShopController');

module.exports.getIndex = (request, response, next) => {

  rendering.render(request, response, 'shop', 'Shop');

  return logger.debug('Page Served');
};

module.exports.getProductsListPage = (request, response, next) => {
  return http(`${serviceDirectory.ProductsServiceUrl}/api/products`, { json: true }, (err, res, body) => {
    if (err) { return logger.fatal(err); }

    if (body.code !== 200) {
      logger.error(`External Error: ${body.message}`);
      return response.redirect(`/shop/products?success=false&error=${body.message}`)
    }

    logger.info(`Loaded ${body.data.length} product(s)`);

    rendering.render(request, response, 'shop/product-list', 'Shop', { products: body.data.map(b => Product.Parse(b)) });

    return logger.debug('Page Served');
  });
};

module.exports.getProductDetailsPage = (request, response, next) => {
  return http(`${serviceDirectory.ProductsServiceUrl}/api/product/${request.params.id}`, { json: true }, (err, res, body) => {
    if (err) { return logger.fatal(err); }

    if (body.code !== 200) {
      logger.error(`External Error: ${body.message}`);
      return response.redirect(`/shop?success=false&error=${body.message}`);
    }

    const cart = request.app.get('cart');
    const existingCartItem = cart.FindItem(request.params.id);

    rendering.render(request, response, 'shop/product-details', `Shop::${body.data.name}`, {
      quantityInCart: existingCartItem ? existingCartItem.Quantity : 0,
      product: Product.Parse(body.data)
    });

    return logger.debug('Page Served');
  });
};

module.exports.getCartPage = (request, response, next) => {
  rendering.render(request, response, 'shop/cart', `Cart`);

  return logger.debug('Page Served');
};

module.exports.postAddToCart = (request, response, next) => {

  let qty = parseInt(request.body.quantity);
  const product = Product.Parse(request.body);
  const cart = request.app.get('cart');

  const existingCartItem = cart.FindItem(product.Id);
  if (existingCartItem) {
    existingCartItem.Quantity += qty;
    qty = existingCartItem.Quantity;
  }
  else {
    cart.AddItem(product, qty);
  }

  rendering.render(request, response, `shop/product-details`, `Shop::${product.name}`, {
    quantityInCart: qty,
    product: product
  });

  return logger.debug('Page Served');
};

module.exports.postEditCartItem = (request, response, next) => {

  const qty = parseInt(request.body.quantity);
  const cart = request.app.get('cart');

  const existingCartItem = cart.FindItem(request.params.id);
  if (existingCartItem) {
    cart.RemoveItem(request.params.id, existingCartItem.Quantity - qty);
  }

  rendering.render(request, response, 'shop/cart', `Cart`);

  return logger.debug('Page Served');
};

module.exports.getRemoveCartItem = (request, response, next) => {

  const cart = request.app.get('cart');

  cart.RemoveItem(request.params.id);

  rendering.render(request, response, 'shop/cart', `Cart`);

  return logger.debug('Page Served');
};

module.exports.getCheckoutPage = (request, response, next) => {

  const cart = request.app.get('cart');
  if (cart.IsEmpty) {
    response.redirect('/');
  }
  else 
  {
    rendering.render(request, response, 'shop/checkout', 'Checkout');
  }

  return logger.debug('Page Served');
};