module.exports = class IndexRequestHandler extends require('./requestHandler').GetRequestHandler {
    constructor() {
        super('/');
    }

    handle(request, response) {
        super.handle(request, response);
        response.write(
            `<html>
                <head><title>Node.JS</title></head>
                <body>
                    <form action="/message" method="POST">
                        <input type="text" name="message"/>
                        <input type="number" name="repeat" value="1"/>
                        <button type="submit">Submit</button>
                    </form>
                </body>
            </html>`);
        response.end();
    }
}