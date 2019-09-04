const Framework = require('library.ecommerce.framework');
const rendering = require('../util/rendering');

module.exports = class AuthController extends Framework.Service.Controller {
    constructor() {
        super('Authentication Controller');

        this.Get('/login', (request, response, next) => {
            return rendering.render(request, response, 'auth/login', 'Login');
        });

        this.Get('/logout', (request, response, next) => {
            request.app.authenticator.Logout(request);
            return response.redirect('/');
        });

        this.Get('/register', (request, response, next) => {
            return rendering.render(request, response, 'auth/register', 'Create Account');
        });

        this.Post('/login', (request, response, next) => {
            request.app.authenticator.Login(request, request.body.email, request.body.password);

            return response.redirect('/');
        });
    }
}