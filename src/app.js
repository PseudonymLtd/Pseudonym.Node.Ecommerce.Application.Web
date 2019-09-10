const Framework = require('pseudonym.node.ecommerce.library.framework');
const AdminController = require('./controllers/admin');
const ShopController = require('./controllers/shop');
const AuthController = require('./controllers/auth');
const rendering = require('./util/rendering');
const ServiceDirectory = require('./util/serviceDirectory');
const Cart = require('./models/cart');
const OrderItem = require('./models/orderItem');
const Product = require('./models/product');

const serviceRunner = new Framework.Service.Runner('Shop Application');

serviceRunner.Service.set('serviceDirectory', new ServiceDirectory(serviceRunner.Service));

serviceRunner.Service.use((request, response, next) => {
    request.ProductsServiceClient = request.app.get('serviceDirectory').ProductsServiceClient;
    request.OrdersServiceClient = request.app.get('serviceDirectory').OrdersServiceClient;
    request.ShippingServiceClient = request.app.get('serviceDirectory').ShippingServiceClient;
    next();
});

//HealthChecks
serviceRunner.RegisterDependencyHealthCheck(new Framework.Service.CompliantServiceDependencyCheck('Products Service', 'http://localhost:3001'));
serviceRunner.RegisterDependencyHealthCheck(new Framework.Service.CompliantServiceDependencyCheck('Orders Service', 'http://localhost:3002'));
serviceRunner.RegisterDependencyHealthCheck(new Framework.Service.CompliantServiceDependencyCheck('Shipping Service', 'http://localhost:3003'));

//Redirects
serviceRunner.Service.get('/', (request, response, next) => response.redirect('/shop'));

//Cookies
serviceRunner.RegisterCookie(
    'cart', 
    () => new Cart(), 
    (rawCart) => new Cart(rawCart.items.map(
        i => new OrderItem(
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

serviceRunner.RegisterRoute(null, (error, request, response, next) => {
    return handleError(error, request, response);
});

serviceRunner.RegisterRoute(null, (request, response, next) => {
    return handleError(null, request, response);
});

serviceRunner.UseEjs();

const handleError = (error, request, response) => {
    const errorInfo = serviceRunner.ExceptionHandler.ProcessException(error, request);

    response.status(errorInfo.Code);

    const technicalDetails = errorInfo.Details;
    technicalDetails.requestedUri = request.Uri;
    errorInfo.details = undefined;

    let errorWrap = null;
    console.log(errorInfo.Code);

    switch(errorInfo.Code)  {
        case 400:
            errorWrap = Framework.Service.Responder.BadRequest(errorInfo, technicalDetails);
            break;
        case 401:
            errorWrap = Framework.Service.Responder.Unauthorized(errorInfo, technicalDetails);
            break;
        case 403:
            errorWrap = Framework.Service.Responder.Forbidden(errorInfo, technicalDetails);
            break;
        case 404:
            errorWrap = Framework.Service.Responder.NotFound(undefined, { requestedUri: request.Uri });
            break;
        case 502:
            errorWrap = Framework.Service.Responder.BadGateway(errorInfo, technicalDetails);
            break;
        case 503:
            errorWrap = Framework.Service.Responder.ServiceUnavailable(errorInfo, technicalDetails);
            break;
        default:
            errorWrap = Framework.Service.Responder.InternalServerError(errorInfo, technicalDetails);
            break;
    }

    return rendering.render(request, response, 'error', errorInfo.Message, { 
        error: errorWrap
    });
}

serviceRunner.Start(3000);