var JujuClient = require('../index.js').client;

var j = new JujuClient('http://localhost:6080', 'wNC1/ouP');

j.login().then(function(data) {
  console.log(data);
});

j.info().then(function (data) {
  console.log(data.Response);
});

j.getService('lamp').then(function (data) {
  console.log(data.Response);
});

// j.deployCharm('ubuntu', 'my-ubuntu', {
//   url: 'cs:trusty/ubuntu-0'
// });
