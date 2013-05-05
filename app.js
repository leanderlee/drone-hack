var express = require('express');
var fs = require('fs');
var arDrone = require('ar-drone');
var consolidate = require('consolidate');
var client  = arDrone.createClient();
var app = express();
var http = require("http");
var server = http.createServer(app);
var ds = require("dronestream").listen(server);




app.engine('html', consolidate.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res){
  res.render('index', {
    title: 'Consolidate.js'
  });
});
app.get('/stream', function(req, res){
  res.render('stream', {
    title: 'Consolidate.js'
  });
});


server.listen(3000);
