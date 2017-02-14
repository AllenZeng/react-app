var config;

switch (process.env.NODE_ENV) {
  case 'production': config = require('./prod_config'); break;
  default: config = require('./dev_config'); break;
}

module.exports = config;
