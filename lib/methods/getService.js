/*!
 * JujuClient getService message
 * Released under the GNU license.
 */

module.exports = function (name) {
  return {
    'Type': 'Client',
    'Request': 'ServiceGet',
    'Params': {
      'ServiceName': name
    }
  };
};
