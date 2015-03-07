var util = require('util');
var https = require('https');

function EventHubClient(namespace, eventHub, device, sharedAccessSignature)
{
	var self = this;
	self.namespace = namespace;
	self.eventHub = eventHub;
	self.device = device;
	self.sharedAccessSignature = sharedAccessSignature;

	self.getPathFromEventHubAndDevice = function (eventHub, device) {
		var path = util.format('%s/publishers/%s/messages', eventHub, device);
		return path;
	};

	self.getUrlFromNamespaceAndPath = function (namespace, path) {
		var url = util.format('https://%s.servicebus.windows.net/%s', namespace, path);
		return url;
	};

	self.getHttpsRequestOptions = function(method, namespace, path, contentLength, sharedAccessSignature) {
		var url = self.getUrlFromNamespaceAndPath(namespace, path);

		var options = {
			hostname: util.format('%s.servicebus.windows.net', namespace),
			path: util.format('/%s', path),
			port: 443,
			method: method,
			headers: {
				'Authorization': sharedAccessSignature,
				'Content-Type': 'application/atom+xml;type=entry;charset=utf-8',
				'Content-Length': contentLength,
			}
		};

		return options;
	};

	return {
		sendEvent: function (event, callback) {
			var path = self.getPathFromEventHubAndDevice(
				self.eventHub,
				self.device
			);

			var payload = JSON.stringify(event);

			var options = self.getHttpsRequestOptions(
				'POST',
				self.namespace,
				path,
				payload.length,
				self.sharedAccessSignature
			);

			console.log(options);

			var request = https.request(options, function(response) {
				response.on('data', function(data) {
					console.log(data);
					callback(null);
				});
			});

			request.on('error', function (err) {
				callback(err);
			});

			request.write(payload);
			request.end();
		}
	};
}

exports.createEventHubClient = function(namespace, eventHub, device, sharedAccessSignature) {
  var client = new EventHubClient(namespace, eventHub, device, sharedAccessSignature);
  return client;
};
