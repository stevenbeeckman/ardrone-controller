var arDrone = require('ar-drone');
var http = require('http');

var client = arDrone.createClient();

var options = {host: '127.0.0.1'
				, port: 3000
				, path: '/api/raw'
				, method: 'POST'};

client.config('general:navdata_demo', 'FALSE'); // get all the data

client.animateLeds('blinkGreenRed', 5, 10);

client.takeoff();

client
  /*.after(500, function() {
    this.clockwise(0.2);
  })*/
  .after(3000, function() {
    this.stop();
    this.land();
  });

client.on('navdata', function(data){
	//console.dir(data);
	//	console.log("Received data: " + data.time);
	//console.dir(data.demo);
	//console.dir(data.rawMeasures);
	//console.dir(data.physMeasures);

	/*
	var data_to_be_sent = JSON.stringify(
		{header:
			{
				header: data.header
				, demo: data.demo
				, rawMeasures: data.rawMeasures
				, physMeasures: data.physMeasures
				, time: data.time
				, sequenceNumber: data.sequenceNumber
				, droneState: data.droneState
				, pwm: data.pwm
				, altitude: data.altitude
				, pressureRaw: data.pressureRaw
				, magneto: data.magneto
				, windSpeed: data.windspeed
				, kalmanPressure: data.kalmanPressure
			}
		}
		);
	*/

	var raw_data_header = new Object();

	if(data.rawMeasures && data.demo && data.pwm){
		raw_data_header = {
			header: {
				time: data.time
				, sequenceNumber: data.sequenceNumber
				, flying: data.droneState.flying
				, batteryMilliVolt: data.rawMeasures.batteryMilliVolt
				, altitude: data.demo.altitude
				, velocity: {x: data.demo.xVelocity
							, y: data.demo.yVelocity
							, z: data.demo.zVelocity}
				, throttle: {forward: data.pwm.gazFeedForward
							, height: data.pwm.gazAltitude}
			}
		};
	}else{
		raw_data_header = {
			header: {
				time: data.time
				, sequenceNumber: data.sequenceNumber
				, flying: data.droneState.flying
				, batteryMilliVolt: 0
				, altitude: 0
				, velocity: {x: 0
							, y: 0
							, z: 0}
				, throttle: {forward: 0
							, height: 0}
			}
		};
	}

	var data_to_be_sent = JSON.stringify(raw_data_header);
	var headers = {
		'Content-Type': 'application/json'
		, 'Content-Length': data_to_be_sent.length
	};
	options.headers = headers;

	var req = http.request(options, function(res){
		//console.log(res);
		console.log("Received response.")
	});
	console.log("Sending data...");


	console.log(data_to_be_sent);
	req.write(data_to_be_sent);
	/*	req.write(JSON.stringify({header: data.header
							, demo: data.demo
							, rawMeasures: data.rawMeasures
							, physMeasures: data.physMeasures
							, time: data.time
							, sequenceNumber: data.sequenceNumber
							, droneState: data.droneState
							, pwm: data.pwm
							, altitude: data.altitude
							, pressureRaw: data.pressureRaw
							, magneto: data.magneto
							, windSpeed: data.windspeed
							, kalmanPressure: data.kalmanPressure}));
	*/
	req.end();
	console.log("Data sent.");
});
