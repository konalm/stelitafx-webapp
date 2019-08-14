const devConfig = require('./dev.js');
const prodConfig = require('./prod.js');
const host = window.location.hostname;

let config;
switch (host) {
  case "localhost":
    config = devConfig;
    break;
  case 'fx.stelita.app':
    config = prodConfig;
}

module.exports = config;
