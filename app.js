var express = require('express');
var fs = require('fs');
var arDrone = require('ar-drone');
var consolidate = require('consolidate');
var control = arDrone.createUdpControl();
var app = express();
var http = require("http");
var server = http.createServer(app);
var ds = require("dronestream").listen(server);


var string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
var urlToFile = function (string, filename) {
	filename = filename || "data.png";
	var regex = /^data:.+\/(.+);base64,(.*)$/;
	var matches = string.match(regex);
	var ext = matches[1];
	var data = matches[2];
	var buffer = new Buffer(data, 'base64');
	fs.writeFileSync(filename, buffer);
}

app.engine('html', consolidate.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + "/static"));

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

var Drone, app, arDrone, control, drone, ejs, express, io, pcmd, port, ref, start,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
start = Date.now();
ref = {};
pcmd = {};
Drone = (function() {

  function Drone(speed) {
    this.decreaseSpeed = __bind(this.decreaseSpeed, this);

    this.increaseSpeed = __bind(this.increaseSpeed, this);

    this.commands = __bind(this.commands, this);
    this.speed = speed;
    this.accel = 0.01;
  }

  Drone.prototype.takeoff = function() {
    console.log("Takeoff ...");
    ref.emergency = false;
    return ref.fly = true;
  };

  Drone.prototype.land = function() {
    console.log("Landing ...");
    ref.fly = false;
    return pcmd = {};
  };

  Drone.prototype.stop = function() {
    return pcmd = {};
  };

  Drone.prototype.commands = function(names) {
    var name, _i, _len;
    pcmd = {};
    for (_i = 0, _len = names.length; _i < _len; _i++) {
      name = names[_i];
      pcmd[name] = this.speed;
    }
    return console.log('PCMD: ', pcmd);
  };

  Drone.prototype.increaseSpeed = function() {
    this.speed += this.accel;
    return console.log(this.speed);
  };

  Drone.prototype.decreaseSpeed = function() {
    this.speed -= this.accel;
    return console.log(this.speed);
  };

  return Drone;

})();

setInterval((function() {
  control.ref(ref);
  control.pcmd(pcmd);
  return control.flush();
}), 30);

drone = new Drone(0.5);

drone.speed = 0.4;

console.log(drone);

io = require("socket.io").listen(3001);

io.sockets.on("connection", function(socket) {
  socket.on("takeoff", drone.takeoff);
  socket.on("land", drone.land);
  socket.on("stop", drone.stop);
  socket.on("command", drone.commands);
  socket.on("increaseSpeed", drone.increaseSpeed);
  socket.on("process-image", function (data) {
  	urlToFile(data.data);
  });
  return socket.on("decreaseSpeed", drone.decreaseSpeed);
});