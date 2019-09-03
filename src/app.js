const Framework = require('library.ecommerce.framework');
const AdminController = require('./controllers/admin');
const ShopController = require('./controllers/shop');
const AuthController = require('./controllers/auth');
const rendering = require('./util/rendering');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');
const Product = require('./models/product');

const serviceRunner = new Framework.Service.Runner('Shop Application');

serviceRunner.UseEjs();

serviceRunner.Service.set('postal-services', [
    {
        Id: 1,
        Name: 'Standard Delivery',
        Window: '3 to 5 Working Days',
        Price: 3.49
    },
    {
        Id: 2,
        Name: 'Express Delivery',
        Window: '1 to 2 Working Days',
        Price: 4.99
    },
    {
        Id: 3,
        Name: 'Special Delivery',
        Window: '1 Working Day',
        Price: 7.24
    }
  ]);

//Redirects
serviceRunner.Service.get('/', (request, response, next) => response.redirect('/shop'));

//Cookies
serviceRunner.RegisterCookie(
    'cart', 
    () => new Cart(), 
    (rawCart) => new Cart(rawCart.items.map(
        i => new CartItem(
            new Product(i.product.id, i.product.name, i.product.description, i.product.price, i.product.imageUri),
            i.quantity))),
    true);

serviceRunner.RegisterCookie('preferences', () => Object.create({ postalServiceId: -1 }), (p) => p, false);

//Statics
serviceRunner.RegisterStatic('/', 'public');
serviceRunner.RegisterStatic('/', '../node_modules/bootstrap/dist');
serviceRunner.RegisterStatic('/js', '../node_modules/jquery/dist');

//Controllers
serviceRunner.RegisterController('/auth', new AuthController());
serviceRunner.RegisterController('/admin', new AdminController());
serviceRunner.RegisterController('/shop', new ShopController());

//Routes
serviceRunner.RegisterRoute(null, (error, request, response, next) => {
    return handleError(error, request, response);
});

serviceRunner.RegisterRoute(null, (request, response, next) => {
    return handleError(null, request, response);
});

const handleError = (error, request, response) => {
    const errorInfo = serviceRunner.ExceptionHandler.ProcessException(error, request);

    response.status(errorInfo.Code);

    const technicalDetails = errorInfo.Details;
    errorInfo.details = undefined;

    return rendering.render(request, response, 'error', errorInfo.Message, { 
        error: Framework.Service.Responder.InternalServerError(errorInfo, technicalDetails)
    });
}

serviceRunner.Start(3000);