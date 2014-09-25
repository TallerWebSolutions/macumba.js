/*!
 * JujuClient addCharm message
 * Released under the GNU license.
 */

module.exports = function (url) {
  return {
    'Type': 'Client',
    'Request': 'AddCharm',
    'Params': {
      'URL': url
    }
  };
};
