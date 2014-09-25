/*!
 * JujuClient getWatchedTasks message
 * Released under the GNU license.
 */

module.exports = function (id) {
  return {
    'Type': 'AllWatcher',
    'Request': 'Next',
    'Id': id
  };
};
