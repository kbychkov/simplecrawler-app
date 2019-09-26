// Initializes the `crawler` service on path `/simplecrawler`
const createService = require('./simplecrawler.class.js');
const hooks = require('./simplecrawler.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/simplecrawler', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('simplecrawler');

  service.hooks(hooks);
};
