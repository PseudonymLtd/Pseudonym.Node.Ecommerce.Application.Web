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
            return rendering.render(request, response, 'auth/register', 'Create Account', {
                passwordRegex: this.PasswordRegex,
                failReason: request.query.fail
            });
        });

        this.Post('/login', (request, response, next) => {
            console.log(request.body);

            const encrypted = request.Environment.AESManager.EncryptForPrivate(request.body.email);
            console.log(encrypted);

            const decrypted = request.Environment.AESManager.DecryptFromPublic(request.body.password);
            console.log(decrypted);

            return request.Environment.Authenticator.Login(request, new Framework.Models.User(77, 'Frank', 'Bobson', request.body.email), ['Administrator'], (err) => {
                if (err) {
                    return next(err);
                }
                
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
        });

        this.Post('/register', (request, response, next) => {
            const decryptedPassword1 = request.Environment.AESManager.DecryptFromPublic(request.body.password[0]);
            const decryptedPassword2 = request.Environment.AESManager.DecryptFromPublic(request.body.password[1]);

            if (decryptedPassword1 !== decryptedPassword2) {
                return response.redirect(`/auth/register?fail=${encodeURIComponent('Passwords do not match')}`);
            }
    
            const regex = new RegExp(this.PasswordRegex);

            if (!regex.test(decryptedPassword1)) {
                return response.redirect(`/auth/register?fail=${encodeURIComponent('Password must adhere to the provided critera')}`);
            }
            
            console.log(request.body);

            //create user with bcrypt

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

    get PasswordRegex() {
        return `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.])(?=.{8,})`;
    }
}