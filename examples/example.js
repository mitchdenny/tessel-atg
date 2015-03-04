var tessel = require('tessel');
var ble = require('ble-ble113a');
var publishers = require('../lib/publishers');
var sen10737p = require('tessel-sen10737p');
var atg = require('../index');

// Get the Bluetooth stack up and running.
var blePort = tessel.port['B'];
var controller = ble.use(blePort);
var publisher = publishers.createBluetoothPublisher(controller);

// Get the ultrasonic ranger up and running.
var gpioPort = tessel.port['GPIO'];
var pin = gpioPort.pin['G3'];
var ranger = sen10737p.use(pin);

var monitor = atg.use(publisher, ranger);

monitor.start();
