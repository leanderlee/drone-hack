var arDrone = require('ar-drone');
var client  = arDrone.createClient();
client.takeoff();
client.after(5000, function () {
	client.up(0.5);
});

client.after(1000, function () {
	client.animate('flipLeft',1500)
});

client.after(10000, function () {
	this.land();
});