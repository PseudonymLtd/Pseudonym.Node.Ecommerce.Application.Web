const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const saveFilePath = 'data/products.json';
const style = fs.readFileSync('css/style.css').toString();
let products = [];

app.use((request, response, next) =>
{
    log('INFO', 'Request Started');
    next();
});

app.use(bodyParser.urlencoded({extended: false}));

app.use('/add-product', (request, response, next) =>
{
    response.send(
        `<html>
            <head>
                <title>Shop::Add Product</title>
                <style>${style}</style>
            </head>
            <body>
                <h1>Add Product</h1>
                <form action="/create-product" method="POST">
                    <div>
                        <label for="nameInput">Name: </label>
                        <input id="nameInput" type="text" name="name"/>
                    </div>
                    <div>
                        <label for="descInput">Description: </label>
                        <input id="descInput" type="text" name="description"/>
                    </div>
                    <div>
                        <label for="priceInput">Price: </label>
                        <input id="priceInput" type="price" name="price" value="1"/>
                    </div>
                    <div>
                        <button type="submit">Add</button>
                    </div>
                </form>
            </body>
        </html>`);

    log('INFO', 'Request Ended');
});

app.use('/create-product', (request, response, next) =>
{
    products.push(request.body);

    fs.writeFile(saveFilePath, JSON.stringify(products), (err) => {
        if (err === null) {
            response.redirect('/');

            log('INFO', 'Request Ended');
            return;
        }
        throw err;
    });
});

app.use((request, response, next) =>
{
    response.send(
        `<html>
            <head>
                <title>Shop</title>
                <style>${style}</style>
            </head>
            <body>
                <h1>Shop</h1>
                <div class="products">
                    ${getProducts()}
                </div>
                <footer><a href="/add-product">Add Product</a></footer>
            </body>
        </html>`);

    log('INFO', 'Request Ended');
});

const log = (severity, message) => console.log(`${Date.now()} [${severity.toUpperCase()}] - ${message}`);
const getProducts = () => products.map(p => 
    `<div class="product">
        <h3>${p.name}</h3>
        <div class="description">
            <span><i>${p.description}</i></span>
        </div>
        <div>
            <span><b>£${p.price}</b></span>
        </div>
    </div>`).join('');

log('INFO', 'Loading products...');

fs.readFile(saveFilePath, (err, data) => {
    if (err === null) {
        
        products = JSON.parse(data.toString());
        log('INFO', `Loaded ${products.length} product(s)`);

        app.listen(3000);
        return;
    }
    throw err;
});