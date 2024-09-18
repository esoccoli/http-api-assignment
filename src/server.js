const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const xmlHandler = require('./xmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) =>
{
    console.log(request.url);

    switch (request.url)
    {
        case '/':
            htmlHandler.getIndex(request, response);
            break;
        case '/style.css':
            htmlHandler.getStyles(request, response);
            break;
    }
}