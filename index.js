function Monitor(controller, ranger) {
  var self = this;
  self.controller = controller;
  self.ranger = ranger;
  self.isStarted = false;
  self.isReady = false;
  self.measureIntervaxl = null;

  self.controller.on('ready', function (err) {
    console.log('ready');
    self.isReady = true;

    if (self.isStarted) {
      self.startInternal();
    }
  });

  self.controller.on('connect', function () {
    console.log('connect');
    self.measureInterval = setInterval(function () {
      ranger.getDistance(function(err, distance) {
        if (err) {
          console.log(err);
          return;
        }

        console.log(distance);
        controller.writeLocalValue(0, new Buffer(distance), function (err) {
          console.log(err);
          return;
        });
      });
    }, 1000);
  });

  self.controller.on('disconnect', function () {
    console.log('disconnect');
    clearInterval(self.measureInterval);

    if (self.isStarted) {
      self.controller.startAdvertising();
    }
  });

  self.startInternal = function() {
    self.controller.startAdvertising();
  };

  self.stopInternal = function() {
    self.controller.stopAdvertising();
  };

  return {
    start: function() {
      self.isStarted = true;

      if (self.isReady) {
        self.startInternal();
      }
    },
    stop: function() {
      self.isStarted = false;

      if (self.isReady) {
        self.stopInternal();
      }
    }
  };
}

function use(controller, ranger) {
  var monitor = new Monitor(controller, ranger);
  return monitor;
}

exports.use = use;
