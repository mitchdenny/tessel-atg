var tessel = require('tessel');
var ble = require('ble-ble113a');
var publishers = require('./lib/publishers');
var sen10737p = require('tessel-sen10737p');
var atg = require('./lib/monitor');

// Get the Bluetooth publisher configured.
var blePort = tessel.port['B'];
var controller = ble.use(blePort);
var publisher = publishers.createBluetoothPublisher(controller);

// // Get the Event Hub publisher configured.
// var namespace = 'tessel-atg';
// var eventHub = 'theessel-atg-tenant1';
// var device = 'tessel-atg-tenant1-device1';
// var sharedAccessSignature = 'SharedAccessSignature sr=https%3A%2F%2Ftessel-atg.servicebus.windows.net%2Ftessel-atg-tenant1%2Fpublishers%2Ftessel-atg-tenant1-device1%2Fmessages&sig=EPKqXdzcCzzgCJRAome1kdbGxbqAtcZyaT2oKP3f7UY%3D&se=1454612852&skn=tessel-atg-tenant1-policy1';
// var publisher = publishers.createEventHubPublisher(namespace, eventHub, device, sharedAccessSignature);

// Get the ultrasonic ranger up and running.
var gpioPort = tessel.port['GPIO'];
var pin = gpioPort.pin['G3'];
var ranger = sen10737p.use(pin);

var monitor = atg.use(publisher, ranger);
monitor.start();
