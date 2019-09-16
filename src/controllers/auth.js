const http = require('request');

const Framework = require('pseudonym.node.ecommerce.library.framework');
const rendering = require('../util/rendering');

module.exports = class AuthController extends Framework.Service.Controller {
    constructor() {
        super('Authentication Controller');

        this.Get('/login', (request, response, next) => {
            return rendering.render(request, response, 'auth/login', 'Login',{
                isChallenge: request.session.challengeOrigin !== undefined,
                invalidCredentials : request.query.invalidCredentials
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
            return request.AuthServiceClient.Head('api/health/warmup', (body) => {
                const encryptedPassword = request.Environment.AESManager.EncryptForPrivate(
                    request.Environment.AESManager.DecryptFromPublic(request.body.Password),
                    request.AuthServiceClient.CompliantServicePublicKey);

                return request.AuthServiceClient.Post('auth/login', 
                    {
                        Index: request.body.Email,
                        Type: 'User',
                        Password: encryptedPassword
                    }, 
                    (body) => {
                        const identity = body.data;
                        return request.Environment.Authenticator.Login(request, 
                            new Framework.Models.User(identity._id, identity._firstname, identity._lastname, identity._email),
                            identity._roles.map(r => r._name), 
                            (err) => {
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
                    }, 
                    (err) => {
                        if (err.code === 401) {
                            request.Environment.Logger.Debug('Authentication Failed:');
                            console.debug(err);
                            return response.redirect('/auth/login?invalidCredentials=true');
                        }
                        else {
                            return next(err);
                        }
                    });
            }, next)
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
            
            return request.AuthServiceClient.Head('api/health/warmup', (body) => {
                const encryptedPassword = request.Environment.AESManager.EncryptForPrivate(decryptedPassword1, request.AuthServiceClient.CompliantServicePublicKey);
                return request.AuthServiceClient.Post('api/user', 
                    {
                        Firstname: request.body.firstname,
                        Lastname: request.body.lastname,
                        Email: request.body.email,
                        Password: encryptedPassword
                    }, 
                    (body) => {
                        return response.redirect('/');
                    }, next);
            }, next);
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