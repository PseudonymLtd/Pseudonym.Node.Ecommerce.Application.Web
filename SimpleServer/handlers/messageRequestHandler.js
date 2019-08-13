const fs = require('fs');

module.exports = class MessageRequestHandler extends require('./requestHandler').PostRequestHandler {
    constructor() {
        super('/Message');
    }

    handle(request, response) {
        super.handle(request, response);

        request.on('end', () => {
            const formDictionary = this.Body.split('&')
                                  .map(fi => fi.split('='))
                                  .map(kvp => {
                                      return {
                                        key: kvp[0].toLowerCase(),
                                        value: kvp[1]
                                    };
                                  });

            const message = formDictionary.find(kvp => kvp.key === 'message').value;
            const count = parseInt(formDictionary.find(kvp => kvp.key === 'repeat').value);

            let writes = 0;
            for (let i=0; i < count; i++) {
                fs.appendFile('message.log', `${message}\r\n`, (err) => {
                    writes++;
                    if (writes >= count) {
                        response.statusCode = 302;
                        response.setHeader('Location', '/');
                        response.end();
                    }
                });
            }
        });
    }
}