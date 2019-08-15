const http = require('http');
const fs = require('fs');

module.exports = class Service {
    constructor()
    {
        this.registerHandlers();

        this._server = http.createServer((request, response) => {
            var requesthandler = this._handlers.map(h => new h())
                                               .find(h => h.Uri === request.url.toLowerCase() 
                                                            && h.Method === request.method);
            if (requesthandler != undefined)
            {
                try
                {
                    requesthandler.handle(request, response);
                }
                catch (err)
                {
                    console.error(err);
                }
            }
            else 
            {
                this._errorHandler.handle(request, response);
            }
        });
    }

    registerHandlers() {
        console.log('Registering request handlers');

        const errorHandler = require('./handlers/errorHandler');
        this._errorHandler = new errorHandler();

        this._handlers = fs.readdirSync('./handlers')
                        .filter(fileName => fileName.endsWith('RequestHandler.js'))
                        .map(moduleName => require(`./handlers/${moduleName}`));

        console.log(this._handlers);
    }

    start()
    {
        this._server.listen(3000);
    }
}