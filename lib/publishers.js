var bleadvertise = require('bleadvertise');

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

exports.createBluetoothPublisher = function (controller) {
  var publisher = new BluetoothPublisher(controller);
  return publisher;
}
