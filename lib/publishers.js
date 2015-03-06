var bleadvertise = require('bleadvertise');
var servicebus = require('./servicebus');

var BluetoothPublisher = function (controller) {
  var self = this;
  self.controller = controller;

  self.controller.on('ready', function() {
    console.log('ready!');

    var packet = {
      shortName: 'shortName'
    };

    var payload = bleadvertise.serialize(packet);

    console.log(payload);

    self.controller.setAdvertisingData(payload, function (err) {
      if (err) {
        console.log(err);
        return;
      }

      console.log('advertising data set');
    });

    self.controller.startAdvertising();
  });

  self.controller.on('connect', function() {
    console.log('connect!');
  });

  self.controller.on('disconnect', function() {
    console.log('disconnect!');
  });

  return {
    publishDistance: function(distance) {
      console.log(distance);
    }
  }
}



var EventHubPublisher = function(namespace, eventHub, device, sharedAccessSignature) {
  var self = this;
  self.namespace = namespace;
  self.eventHub = eventHub;
  self.device = device;
  self.sharedAccessSignature = sharedAccessSignature;

  return {
    publishDistance: function(distance) {
      var event = {
        device: device,
        distance: distance
      };

      var client = servicebus.createEventHubClient(
        namespace, eventHub, device, sharedAccessSignature
        );

      client.sendEvent(event, function(err) {
        if (err) {
          console.log(err);
          return;
        }

        console.log(event);
      });
    }
  }
}

exports.createEventHubPublisher = function(namespace, eventHub, device, sharedAccessSignature) {
  var publisher = new EventHubPublisher(namespace, eventHub, device, sharedAccessSignature);
  return publisher;
}

exports.createBluetoothPublisher = function (controller) {
  var publisher = new BluetoothPublisher(controller);
  return publisher;
}
