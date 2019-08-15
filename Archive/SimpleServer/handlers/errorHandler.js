module.exports = class ErrorHandler {
    constructor() {
    }

    handle(request, response) {
        console.error(`[Error] Registered Handler Invoked:\r\n - A page handler was not found for request type ${request.method}.\r\n - Requested Uri: ${request.url}`);

        response.statusCode = 500;
        response.write(
            `<html>
                <head><title>Node.JS</title></head>
                <body>
                    <h1>500 Internal Server Error</h1>
                    <span>A page handler was not found for request type ${request.method}\r\nRequested Uri: ${request.url}</span>
                </body>
            </html>`);
        response.end();
    }
}