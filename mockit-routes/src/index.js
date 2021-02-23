const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const app = express();
const cors = require('cors');
const handlebars = require("handlebars");


require('handlebars-helpers')({
  handlebars: handlebars
});
require('./custom-helpers')({
  handlebars: handlebars
});

const port = process.env.PORT || 3000;

const delayMiddleware = require('./middlewares/delay');
const chaosMonkeyMiddleware = require('./middlewares/chaos-monkey');
const basicAuth = require('./middlewares/basic-auth');

const data = fs.readJsonSync(
  path.resolve(__dirname, '../configuration/routes.json')
);
const {
  routes,
  settings: { features: { cors: corsFeature } = {} } = {}
} = data;

app.use(basicAuth);
app.use(delayMiddleware);
app.use(chaosMonkeyMiddleware);

if (corsFeature) {
  app.use(cors());
}

app.disable('x-powered-by');

routes.forEach((route) => {
  const {
    route: path,
    statusCode,
    payload,
    disabled = false,
    httpMethod = 'GET',
    headers = []
  } = route;

  const method = httpMethod.toLowerCase();

  if (!disabled) {
    app[method](path, (req, res) => {

      const hbdata = {
        request : req
      };

      headers.forEach(({ header, value } = {}) => {
        try {
          const headerT = handlebars.compile(value);
          res.set(header, headerT(hbdata));
        } catch (error) {
          console.log(error);
        }  
      });

      res.status(statusCode)

      if(payload){
        try {
          const payloadT = handlebars.compile(JSON.stringify(payload));
          res.send(JSON.parse(payloadT(hbdata)));
        } catch (error) {
          res.send({ 'error' : error})
          console.log(error);
        }  
      } else{
        res.send();
      }

      
    });
  }
});

if (process.env.ENV !== 'test') {
  server = app.listen(port, () =>
    console.log(`MockIt app listening on port ${port}!`)
  );
}

module.exports = app;
