const webpackDev = require('./webpack/webpack.dev.js');
const webpackPro = require('./webpack/webpack.prod.js');

let config;
switch (process.env.NODE_ENV) {
  case 'production': config = webpackPro; break;
  default: config = webpackDev; break;
}

module.exports = config;
