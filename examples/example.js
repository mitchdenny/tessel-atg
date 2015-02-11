var tessel = require('tessel');

var ble = require('ble-ble113a');
var blePort = tessel.port['A'];
var controller = ble.use(blePort);

var sen10737p = require('tessel-sen10737p');
var gpioPort = tessel.port['GPIO'];
var pin = gpioPort.pin['G3'];
var ranger = sen10737p.use(pin);

var atg = require('../index');
var monitor = atg.use(controller, ranger);

monitor.start();
