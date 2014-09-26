/*!
 * JujuClient deployCharm message
 * Released under the GNU license.
 */
var lodash = require('lodash');
module.exports = function (name, charm, params) {

  if (!name || !charm || !params.url) return false;

  params = lodash.defaults(params || {}, {
    // @TODO: Get the URI of the charm.
    // url: this.getInfoFromCS('drupal').charm.url,
    url: "",
    config: {},
    num_units: 1,
    constraints: {},
  });

  return {
    'Type': 'Client',
    'Request': 'ServiceDeploy',
    'Params': {
      'ServiceName': name,
      'Config': params.config,
      'Constraints': params.constraints,
      'CharmUrl': params.url,
      'NumUnits': params.num_units
    }
  };
};
