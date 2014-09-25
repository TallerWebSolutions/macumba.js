/*!
 * macumba.js
 * Released under the GNU license.
 */

var JujuClient = require('./lib/JujuClient');
var JujuSocket = require('./lib/JujuSocket');

JujuClient.client = JujuClient;
JujuClient.socket = JujuSocket;

module.exports = JujuClient;
