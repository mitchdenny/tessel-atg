var bleadvertise = require('bleadvertise');
var util = require('util');
var servicebus = require('./servicebus');

var BluetoothPublisher = function (controller) {
  var self = this;
  self.controller = controller;
  self.isConnected = false;

  self.advertise = function() {
    var packet = {
      flags: [0x02, 0x04],
      shortName: 'Tessel'
    };

    var payload = bleadvertise.serialize(packet);

    self.controller.setAdvertisingData(payload, function (err) {
      if (err) {
        console.log(err);
        return;
      }

      self.controller.startAdvertising();
      console.log('advertising!');
    });
  };

  self.controller.on('ready', function() {
    console.log('ready!');
    self.controller.setBondable(true, function(err) {
      if (err) {
        console.log(err);
        return;
      }

      self.advertise();
    });
  });

  self.controller.on('connect', function() {
    console.log('connect!');
    self.isConnected = true;
  });

  self.controller.on('disconnect', function() {
    console.log('disconnect!');
    self.isConnected = false;
    self.advertise();
  });

  return {
    publishDistance: function(distance) {
      console.log('%s (console)', distance);

      if (self.isConnected) {
        console.log('%s (bluetooth)', distance);
        self.controller.writeLocalValue(0, new Buffer(distance.toString()));
      }
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
