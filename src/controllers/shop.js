const http = require('request');
const Logger= require('../util/logging');
const rendering = require('../util/rendering');
const serviceDirectory = require('../util/serviceDirectory');
const HttpClient = require('../util/httpClient');
const Product = require('../models/product');
const Order = require('../models/order');

const logger = new Logger('ShopController');
const httpClient = new HttpClient(serviceDirectory.ProductsServiceUrl);

module.exports.getIndex = (request, response, next) => {
  return rendering.render(request, response, 'shop', 'Shop');
};

module.exports.getProductsListPage = (request, response, next) => {
  return httpClient.Get('api/products', (body) => {

    //export dto to model
    let products = body.data.map(b => Product.Parse(b));
    logger.info(`Loaded ${products.length} product(s)`);

    //apply search critera
    if (request.query.Search && request.query.Search.trim() != '') {
      products = products.filter(p => {
          const words = (p.Name.trim() + ' ' + p.Description.trim()).toLowerCase().split(' ');
          const searchTerms = request.query.Search.trim().toLowerCase().split(' ');

          for (let term of searchTerms) {
            if (words.includes(term)) { return true; }
          }

          return false;
      })
    }

    //update cart objects
    syncCartItems(request, products);

    if (products.length === 1) {
      response.redirect(`/shop/product/${products[0].Id}`);
    }
    else {
      rendering.render(request, response, 'shop/product-list', 'Products', { products: products });
    }
  }, next);
};

module.exports.getProductDetailsPage = (request, response, next) => {
  return httpClient.Get(`api/product/${request.params.id}`, (body) => {
    
    const cart = request.app.get('cart');
    const existingCartItem = cart.FindItem(request.params.id);
    const product = Product.Parse(body.data);

    //update cart object
    if (existingCartItem) {
      existingCartItem.Product = product;
    }

    rendering.render(request, response, 'shop/product-details', `Product Details`, {
      quantityInCart: existingCartItem ? existingCartItem.Quantity : 0,
      product: product
    });
  }, next);
};

module.exports.getCartPage = (request, response, next) => {
  
  const cart = request.app.get('cart');

  if (cart.IsEmpty) {
    return rendering.render(request, response, 'shop/cart', `Cart`);
  }

  return httpClient.Post('api/products', cart.Items.map(ci => ci.Product.Id), (body) => {
    
    //update cart objects
    syncCartItems(request, body.data);

    if (body.code === 202) {
      logger.warn('request for updated products from cart was only partially successful:');
      console.warn(body.additionalInformation);
    }

    return rendering.render(request, response, 'shop/cart', `Cart`);
  }, next);
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

  return response.redirect(`/shop/product/${product.Id}`);
};

module.exports.postEditCartItem = (request, response, next) => {

  const qty = parseInt(request.body.quantity);
  const cart = request.app.get('cart');
  const existingCartItem = cart.FindItem(request.params.id);
  if (existingCartItem) {
    cart.RemoveItem(request.params.id, existingCartItem.Quantity - qty);
  }

  return rendering.render(request, response, 'shop/cart', `Cart`);
};

module.exports.getRemoveCartItem = (request, response, next) => {
  const cart = request.app.get('cart');
  cart.RemoveItem(request.params.id);

  return rendering.render(request, response, 'shop/cart', `Cart`);
};

module.exports.getCheckoutPage = (request, response, next) => {
  const cart = request.app.get('cart');
  if (cart.IsEmpty) {
    response.redirect('/');
  }
  else {
    const postalServices = request.app.get('postal-services');
    const order = new Order(cart.Items);
    order.PostalService = postalServices.find(ps => ps.Id == request.params.postalServiceId);

    rendering.render(request, response, 'shop/checkout', 'Checkout', {
      order: order
    });
  }
};

const syncCartItems = (request, products) => {
  const cart = request.app.get('cart');

  for(let cartItem of cart.Items) {
    const product = products.find(p => p.id === cartItem.Product.Id);
    if (product) {
      cartItem.Product = Product.Parse(product);
    }
    else {
      cart.RemoveItem(cartItem.Product.Id);
    }
  }
}