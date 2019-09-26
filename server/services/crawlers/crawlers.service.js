// Initializes the `crawler` service on path `/api/crawlers`
const createService = require('feathers-mongodb');
const hooks = require('./crawlers.hooks');

module.exports = function (app) {
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use('/api/crawlers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/crawlers');

  mongoClient.then(db => {
    service.Model = db.collection('crawlers');
  });

  service.hooks(hooks);
};
