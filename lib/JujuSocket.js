/*!
 * JujuSocket
 * Released under the GNU license.
 */

var Q = require('q');
var util = require('util');
var WebSocketClient = require('websocket').client;

/**
 * JujuSocket constructor.
 */
function JujuSocket() {

  var socket = this;
  var queued = [];
  var logged = false;
  var requestId = 1;
  var requested = [];
  var connection = null;

  // Inherit WebSocketClient interface.
  WebSocketClient.call(this);

  /**
   * Called when connection is stablished.
   */
  function onConnect(newConnection) {
    newConnection.on('message', onMessage);
    connection = newConnection;
    this.flush();
  }

  /**
   * Called when any message comes from server.
   */
  function onMessage(message) {
    try {
      var match;
      var data = JSON.parse(message.utf8Data);

      if (!data) return this.emit('messageUnknow', message);
      if ((match = findMatch(data))) return executeRequest(match, data);

      this.emit('messageUnknow', message);
    }
    catch(err) {
      this.emit('messageError', err, message);
    }
  }

  /**
   * Helper method to retrieve matching request.
   */
  function findMatch(params) {
    var match = null;

    requested = requested.filter(function (req) {
      if (!match) {
        if (params.RequestId && req.params.RequestId === params.RequestId) {
          return !!(match = req);
        }
      }
      return true;
    });

    return match;
  }

  /**
   * Executes a matched request.
   */
  function executeRequest(req, data) {
    if (req.params.Type === 'Admin' && req.params.Request === 'Login') {
      logged = true;
      socket.emit('loggedIn', req);
    }

    req.deferred.resolve.call(req, data);
  }

  /**
   * Helper method to identify if a request needs a previous login.
   */
  function loginRequired(req) {
    return req.params.Type !== 'Admin' && req.params.Request !== 'Login';
  }

  function registerTimeout(req) {
    if (req.timeout) {
      setTimeout(function () {
        
      }, req.timeout);
    }
  }

  /**
   * Try to send any queued messages.
   */
  this.flush = function () {
    process.nextTick(function () {
      queued = queued.filter(function (req) {
        if (!connection) return true;
        if (!logged && loginRequired(req)) return true;

        req.params.RequestId = requestId++;
        requested.push(req);
        connection.send(JSON.stringify(req.params));
        return false;
      });
    });
  };

  /**
   * Generic message sender.
   * @return {[type]} [description]
   */
  this.send = function (params, timeout) {
    var deferred = Q.defer();
    var req = {
      params: params,
      deferred: deferred,
      date: new Date(),
      timeout: timeout || null
    };

    if (timeout) registerTimeout(req); 

    queued.push(req);
    this.flush();

    return deferred.promise;
  };

  this.on('connect', onConnect);

  // Flush queued requests after login.
  this.on('loggedIn', function () {
    if (queued.length > 0) this.flush();
  });
}

util.inherits(JujuSocket, WebSocketClient);

module.exports = JujuSocket;
