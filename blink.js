var arDrone = require('ar-drone');

var client = arDrone.createClient();

client.config('general:navdata_demo', 'FALSE'); // get all the data

client.animateLeds('blinkGreenRed', 5, 10);

client.on('navdata', console.log);