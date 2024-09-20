const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const styles = fs.readFileSync(`${__dirname}/../client/style.css`);

// Responds to a request from the server with a JSON file and appropriate headers
const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  response.write(content);
  response.end();

  console.log(`JSON Object: ${content}`);
};

// Responds to a request from the server with an XML formatted string and appropriate headers
const respondXML = (request, response, status, object) => {
  let xmlString = '<response>';
  xmlString += `<mesage>${object.message}</mesage>`;
  if (status !== 200) {
    xmlString += `<id>${object.id}</id>`;
  }

  console.log(`XML String: ${xmlString}`);

  response.writeHead(status, {
    'Content-Type': 'text/xml',
    'Content-Length': Buffer.byteLength(xmlString, 'utf8'),
  });
  response.write(xmlString);
  response.end();
};

// Sends a response to a request using the provided information
const respond = (request, response, status, object, format) => {
  if (format === 'text/xml') {
    respondXML(request, response, status, object);
  } else {
    respondJSON(request, response, status, object);
  }
};

// Sends a response back to the server with a 200 status code and the main html page
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// Sends a response back to the server with a 200 status code and the css file
const getStyles = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(styles);
  response.end();
};

const getSuccess = (request, response, format = 'application/json') => {
  const obj = {
    message: 'This is a successful response',
    id: 'success',
  };

  respond(request, response, 200, obj, format);
};

const getBadRequest = (request, response, format = 'application/json') => {
  const obj = {};

  if (!request.query.valid || request.query.valid !== 'true') {
    obj.message = 'Missing valid query parameter set to true';
    obj.id = 'badRequest';
    respond(request, response, 400, obj, format);
  } else {
    obj.message = 'Request contains all required parameters';
    obj.id = 'success';
    respond(request, response, 200, obj, format);
  }
};

const getUnauthorized = (request, response, format = 'application/json') => {
  const obj = {};

  if (!request.query.loggedIn || request.query.loggedIn !== 'yes') {
    obj.message = 'Missing loggedIn query parameter set to yes';
    obj.id = 'unauthorized';
    respond(request, response, 401, obj, format);
  } else {
    obj.message = 'Request contains all required parameters';
    obj.id = 'success';
    respond(request, response, 200, obj, format);
  }
};

const getForbidden = (request, response, format = 'application/json') => {
  const obj = {
    message: 'You do not have access to this content',
    id: 'forbidden',
  };

  respond(request, response, 403, obj, format);
};

const getInternal = (request, response, format = 'application/json') => {
  const obj = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };
  respond(request, response, 500, obj, format);
};

const getNotImplemented = (request, response, format = 'application/json') => {
  const obj = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content',
    id: 'notImplemented',
  };
  respond(request, response, 501, obj, format);
};

const getNotFound = (request, response, format = 'application/json') => {
  const obj = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };
  respond(request, response, 404, obj, format);
};

module.exports = {
  getIndex,
  getStyles,
  getSuccess,
  getBadRequest,
  getUnauthorized,
  getForbidden,
  getInternal,
  getNotImplemented,
  getNotFound,
};
