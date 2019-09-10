const Framework = require('pseudonym.node.ecommerce.library.framework');
const rendering = require('../util/rendering');
const Product = require('../models/product');
const Shipping = require('../models/shipping');
const Order = require('../models/order');

module.exports = class AdminController extends Framework.Service.Controller {
    constructor() {
        super('Admin Controller', ['Administrator']);

        this.Get('/add-product', (request, response, next) => {
            return rendering.renderForm(request, response, 'admin/add-entity', 'Add Product', Product.FormMetaData(), '/admin/manage-products'); 
        });

        this.Post('/add-product', (request, response, next) => {
            return request.ProductsServiceClient.Post('api/product', Product.Parse(request.body), (body) => {
                return response.redirect(`/shop/product/${body.data.id}`);
            }, next);
        });

        this.Get('/add-shipping', (request, response, next) => {
            return rendering.renderForm(request, response, 'admin/add-entity', 'Add Shipping Service', Shipping.FormMetaData(), '/admin/manage-shipping');
        });

        this.Post('/add-shipping', (request, response, next) => {
            return request.ShippingServiceClient.Post('api/shipping', Shipping.Parse(request.body), (body) => {
                return response.redirect('/admin/manage-shipping');
            }, next);
        });

        this.Get('/remove-product/:id', (request, response, next) => {
            return request.ProductsServiceClient.Delete(`api/product/${request.params.id}`, (body) => {
                //Check for item in cart
                const cart = request.cart;
                cart.RemoveItem(request.params.id)
        
                return response.redirect('/admin/manage-products');
            }, next);
        });

        this.Get('/remove-shipping/:id', (request, response, next) => {
            return request.ShippingServiceClient.Delete(`api/shipping/${request.params.id}`, (body) => {
                //reset preferences
                if (request.preferences.postalServiceId == request.params.id) {
                    request.preferences.postalServiceId = -1;
                }
                return response.redirect('/admin/manage-shipping');
            }, next);
        });

        this.Get('/remove-order/:id', (request, response, next) => {
            return request.OrdersServiceClient.Delete(`api/order/${request.params.id}`, (body) => {
                return response.redirect('/admin/manage-orders');
            }, next);
        });

        this.Get('/update-product/:id', (request, response, next) => {
            return request.ProductsServiceClient.Get(`api/product/${request.params.id}`, (body) => {
                rendering.renderForm(request, response, 'admin/update-entity', 'Update Product', Product.FormMetaData(), '/admin/manage-products', Product.Parse(body.data));
            }, next);
        });

        this.Post('/update-product/:id', (request, response, next) => {
            return request.ProductsServiceClient.Put(`api/product/${request.body.Id}`, Product.Parse(request.body), (body) => {
                //Check for item in cart
                const cart = request.cart;
                const existingItem = cart.FindItem(body.data.id);
                if (existingItem) {
                    existingItem.Product.Price = body.data.price;
                }
                return response.redirect('/admin/manage-products');
            }, next);
        });

        this.Get('/update-shipping/:id', (request, response, next) => {
            return request.ShippingServiceClient.Get(`api/shipping/${request.params.id}`, (body) => {
                rendering.renderForm(request, response, 'admin/update-entity', 'Update Shipping Service', Shipping.FormMetaData(), '/admin/manage-shipping', Shipping.Parse(body.data));
            }, next);
        });

        this.Post('/update-shipping/:id', (request, response, next) => {
            return request.ShippingServiceClient.Put(`api/shipping/${request.body.Id}`, Shipping.Parse(request.body), (body) => {
                return response.redirect('/admin/manage-shipping');
            }, next);
        });

        this.Get('/update-order/:id', (request, response, next) => {
            return request.OrdersServiceClient.Get(`api/order/${request.params.id}`, (body) => {
                rendering.renderForm(request, response, 'admin/update-entity', 'Manage Order', Order.FormMetaData(), '/admin/manage-orders', Order.Parse(body.data));
            }, next);
        });

        this.Post('/update-order/:id', (request, response, next) => {
            return request.OrdersServiceClient.Put(`api/order/${request.body.Id}`, { status: request.body.Status }, (body) => {
                return response.redirect('/admin/manage-orders');
            }, next);
        });

        this.Get('/manage-products', (request, response, next) => {
            return request.ProductsServiceClient.Get('api/products', (body) => {
                const products = body.data.map(b => Product.Parse(b));
                this.Logger.info(`Loaded ${products.length} product(s)`);
        
                rendering.render(request, response, 'admin/manage-entities', 'Manage Products', 
                { 
                    entities: products,
                    entityName: products.length > 0 ? products[0].EntityName : 'Product',
                    entityName_Plural: products.length > 0 ? products[0].EntityName : 'Products',
                    canAdd: true
                });
              }, next);
        });

        this.Get('/manage-shipping', (request, response, next) => {
            return request.ShippingServiceClient.Get('api/shipping', (body) => {
                const shippingServices = body.data.map(s => Shipping.Parse(s));
                this.Logger.info(`Loaded ${shippingServices.length} Shipping Services`);
        
                rendering.render(request, response, 'admin/manage-entities', 'Manage Shipping', 
                { 
                    entities: shippingServices,
                    entityName: shippingServices.length > 0 ? shippingServices[0].EntityName : 'Shipping',
                    entityName_Plural: shippingServices.length > 0 ? shippingServices[0].EntityName : 'Shipping',
                    canAdd: true
                });
              }, next);
        });

        this.Get('/manage-orders', (request, response, next) => {
            return request.OrdersServiceClient.Get('api/orders', (body) => {
                const orders = body.data.map(o => Order.Parse(o));
                this.Logger.info(`Loaded ${orders.length} orders`);
        
                rendering.render(request, response, 'admin/manage-entities', 'Manage Orders', 
                { 
                    entities: orders,
                    entityName: orders.length > 0 ? orders[0].EntityName : 'Order',
                    entityName_Plural: orders.length > 0 ? orders[0].EntityName : 'Orders',
                    canAdd: false
                });
              }, next);
        });
    }
}