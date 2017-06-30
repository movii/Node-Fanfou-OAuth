var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var m = require('./router');
var nunjucks = require('nunjucks');

// comfig nunjucks for express
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.disable('view cache');
app.disable('x-powered-by');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static( __dirname + '/public'));

app.use('/', m);

app.listen(3000, function(){
  console.log('Basic Fanfou OAuth is now running on port 3000');
});