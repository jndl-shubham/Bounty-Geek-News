const express        = require('express');

const app            = express();

app.use(express.static('public'))

const port = 8080;

require('./app/routes')(app, {});
app.listen(port, () => {
  console.log('We are live on ' + port);
});