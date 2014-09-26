/*!
 * JujuClient
 * Released under the GNU license.
 */

var Q = require('q');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var JujuSocket = require('./JujuSocket');
var methods = require('require-all')(__dirname + '/methods');

/**
 * JujuClient constructor.
 */
function JujuClient(url, password) {

  var client = this;
  var ready = Q.defer();
  var socket = new JujuSocket();

  /**
   * Called when connection is stablished.
   */
  function onConnect() {
    var credentials = {
      'Type': 'Admin',
      'Request': 'Login',
      'Params': {
        'AuthTag': 'user-admin',
        'Password': password
      }
    };

    // Try to login as soon as connection is received.
    socket.send(credentials).then(ready.resolve, ready.reject);
  }

  /**
   * Attempts to login.
   * @return {promise}
   *   A promised to be resolved when client is ready and rejected
   *   if failed to be ready.
   */
  this.login = function () {
    if (!socket.url) {
      socket.connect(url);
    }

    return ready.promise;
  };

  /**
   * Ready promise getter.
   * @return {promise}
   *   A promised to be resolved when client is ready and rejected
   *   if failed to be ready.
   */
  this.ready = function () {
    return ready.promise;
  };

  // Add all registered methods.
  Object.keys(methods).forEach(function (name) {
    client[name] = function () {
      return socket.send(methods[name].apply(client, [].slice.call(arguments)));
    };
  });

  socket.on('connect', onConnect);
  socket.on('connectFailed', ready.reject);
}

/**
 * Register an API method.
 * @param {string} name The method name, to be used in 'client.[name]'.
 * @param {function} func The method registering function, which
 *   should return a request object.
 */
JujuClient.addMessageMethod = function (name, func) {
  methods[name] = func;
};

util.inherits(JujuClient, EventEmitter);

module.exports = JujuClient;
