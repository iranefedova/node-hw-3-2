const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const api = require('./api');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}));
app.use(express.static(__dirname + '/public'));
app.use("/", api);

app.all('*', (req, res) => {
  res.send('Invalid format');
});

app.use(function(err, req, res, next) {
  console.log(err.stack);
  res.status(500).send({error: 'Something failed! Please try again'});
});

app.listen(3000, () => {
  console.log('Server start... Waiting for connections at port 3000.');
});
