class RequestHandler {
    constructor(uri, method) {
        this._method = method.toUpperCase();
        this._uri = uri.toLowerCase();
    }

    get Method() { 
        return this._method; 
    }

    get Uri() { 
        return this._uri; 
    }

    handle(request, response) {
        console.log(`[INFO] ${this.Method} Method - '${this.Uri}' Registered Handler Invoked`)

        response.setHeader("Content-Type", "text/html");

        if (request.method.toUpperCase() !== this.Method)
        {
            throw `Handler Method Mismatch exception - ${request.method} does not match handler method ${this.Method}`;
        }
        else if (request.url.toLowerCase() !== this.Uri)
        {
            throw `Handler Uri Mismatch exception - '${request.url}' does not match handler uri ${this.Uri}`;
        }
    }
}

class GetRequestHandler extends RequestHandler {
    constructor(uri)
    {
        super(uri, 'GET');
    }

    handle(request, response) {
        super.handle(request, response);
        console.log(this);
    }
}

class PostRequestHandler extends RequestHandler {
    constructor(uri)
    {
        super(uri, 'POST');
        this._body = undefined;
    }

    get Body() { 
        return this._body; 
    }

    handle(request, response) {
        super.handle(request, response);

        const body = [];
        request.on('data', (chunk) => {
            console.log('[INFO] Chunk of data recieved:')
            console.log(chunk);

            body.push(chunk);
        });

        request.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            console.log(`[INFO] body constructed:\r\n${parsedBody}`);
            this._body = parsedBody;

            console.log(this);
        });
    }
}

module.exports.GetRequestHandler = GetRequestHandler;
module.exports.PostRequestHandler = PostRequestHandler;