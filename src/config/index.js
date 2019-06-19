const devConfig = require('./dev.js');
const prodConfig = require('./prod.js');
const host = window.location.hostname;


let config;
switch (host) {
  case "localhost":
    config = devConfig;
    break;
  case 'fx.api.stelita.app':
    console.log('yo ????')
    config = prodConfig;
}


console.log('config >>>')
console.log(config)

module.exports = config;
