const Framework = require('library.ecommerce.framework');
const AdminController = require('./controllers/admin');
const ShopController = require('./controllers/shop');
const rendering = require('./util/rendering');
const Cart = require('./models/cart');

const serviceRunner = new Framework.Service.Runner('Shop Application');

serviceRunner.UseEjs();

serviceRunner.Service.set('cart', new Cart());
serviceRunner.Service.set('selected-postal-service', -1);
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

serviceRunner.Service.get('/', (request, response, next) =>
{
    return response.redirect('/shop');
});

serviceRunner.RegisterStatic('/', 'public');
serviceRunner.RegisterStatic('/', '../node_modules/bootstrap/dist');
serviceRunner.RegisterStatic('/js', '../node_modules/jquery/dist');

serviceRunner.RegisterController('/admin', new AdminController());
serviceRunner.RegisterController('/shop', new ShopController());

serviceRunner.RegisterRoute(null, (error, request, response, next) => {
    if (error !== null && error !== undefined) {

        response.status(500);

        rendering.render(request, response, '500', '500 Internal Server Error', { 
            requestedUri: request.url,
            error: error
        });
    }
    else {
        next();
    }
});

serviceRunner.RegisterRoute(null, (request, response, next) => {
    response.status(404);

    rendering.render(request, response, '404', '404 Not Found', { requestedUri: request.url });
});

serviceRunner.Start(3000);