const http = require('request');

const Framework = require('pseudonym.node.ecommerce.library.framework');
const rendering = require('../util/rendering');

module.exports = class AuthController extends Framework.Service.Controller {
    constructor() {
        super('Authentication Controller');

        this.Get('/login', (request, response, next) => {
            return rendering.render(request, response, 'auth/login', 'Login',{
                isChallenge: request.session.challengeOrigin !== undefined
            });
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

            if (request.session.challengeOrigin) {
                return http(
                    request.session.challengeOrigin.originUri, 
                    { 
                        json: true, 
                        body: request.session.challengeOrigin.originBody,
                        method: request.session.challengeOrigin.originMethod,
                        headers: {
                            cookie: request.headers.cookie
                        }
                    },
                    (err, res, body) => {
                        request.session.challengeOrigin = undefined;

                        return response.send(body);
                    });
            }
            else {
                return response.redirect('/');
            }
        });

        this.Post('/register', (request, response, next) => {
            console.log(request.body);
            return response.redirect('/');
        });

        this.Use('/challenge', (request, response, next) => {
            request.session.challengeOrigin = {
                originUri: decodeURIComponent(request.query.origin),
                originBody: request.body,
                originMethod: request.method
            }

            return response.redirect('/auth/login');
        });
    }
}