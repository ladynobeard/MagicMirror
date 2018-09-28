'use strict';
const awsIot = require('aws-iot-device-sdk');

var app = {}
var JSONpayload = {}
app.TOPIC_TEXT = "myWindow:new-text"

// Setup our AWS IoT device and receive messages
app.setup = function() {
  app.device = awsIot.device({
	keyPath: './certs/8216998aa0-private.key',
	certPath: './certs/8216998aa0-certificate.key',
	caPath: './certs/root-CA.crt',
	clientId: 'myWindow',
	host: 'a2iv64xdl7wtt6.iot.us-east-1.amazonaws.com'	  
  });

  /**
   * AWS IoT - Connecting MagicMirror as a device to our AWS IoT topics
   */
  console.log("Attempt to connect to AWS ");
  app.device.on("connect", function() {
    console.log("Connected to AWS IoT");

    app.device.subscribe(app.TOPIC_TEXT);
    console.log("Subscribed: " + app.TOPIC_TEXT);
	
	
	
  });
	  
  // Listeners
  app.device.on("message", function(topic, payload) {
	JSONpayload = payload.toString();
	JSONpayload = JSONpayload.substring(
					JSONpayload.indexOf(':')+2,
					JSONpayload.lastIndexOf('"'));
    // If successfull, let's let our application know
    for (var i = 0; i < app.callbacks.length; i++) {
      app.callbacks[i](topic, JSONpayload);  
    }
  });

}

// Callbacks that will be invoked when a message is received
app.callbacks = [];

app.onMessage = function(callback) {
  app.callbacks.push(callback);
}

module.exports = app
