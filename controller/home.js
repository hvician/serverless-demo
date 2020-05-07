const serverless = require('serverless-http');
const express = require('express');
var exphbs = require('express-handlebars');

const app = express();
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.engine('handlebars', exphbs());

app.set('view engine', 'handlebars');

app.use(function(req, res, next) {
  res.locals.val = req.headers.host;

  console.log('res locals', res.locals);

  next();
});

app.get('/', async (req, res) => {
  await res.render('home', { newval: 'test' });
});

app.get('/microservice', async (req, res) => {
  await res.render('microservice', { newval: 'this is a sample microservice' });
});

module.exports.handler = serverless(app);
