const Framework = require('pseudonym.node.ecommerce.library.framework');
const rendering = require('../util/rendering');

module.exports = class AuthController extends Framework.Service.Controller {
    constructor() {
        super('Authentication Controller');

        this.Get('/login', (request, response, next) => {
            return rendering.render(request, response, 'auth/login', 'Login');
        });

        this.Get('/logout', (request, response, next) => {
            return request.Environment.Authenticator.Logout(request, err => {
                if (err)
                {
                    return next(err);
                }
                return response.redirect('/');
            });
        });

        this.Get('/register', (request, response, next) => {
            return rendering.render(request, response, 'auth/register', 'Create Account');
        });

        this.Post('/login', (request, response, next) => {

            const encryptedPassword = request.body.password;

            request.Environment.Authenticator.Login(request, new Framework.Models.User(77, 'Frank', 'Bobson', request.body.email), ['Administrator']);

            return response.redirect('/');
        });

        this.Post('/register', (request, response, next) => {
            console.log(request.body);
            return response.redirect('/');
        });
    }
}