const url = require('url');

module.exports = (pathname, options) => {
  if (typeof pathname === 'object') {
    options = pathname;
    pathname = '';
  }

  if (!options) options = {};

  return url.format({
    hostname: options.host || 'localhost',
    protocol: 'http',
    port: options.port || 3030,
    pathname
  });
};
