var arDrone = require('ar-drone');
var express = require('express');
var consolidate = require('consolidate');


var client  = arDrone.createClient();

var app = express();
app.engine('html', consolidate.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.get('/', function(req, res){
  res.render('index', {
    title: 'Consolidate.js'
  });
});

app.listen(3000);