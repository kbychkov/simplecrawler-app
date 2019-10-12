const createCrawler = require('../../hooks/create-crawler');
const { alterItems, disallow, setNow } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [],
    find: [disallow('external')],
    get: [],
    create: [createCrawler(), setNow('created_at', 'updated_at')],
    update: [disallow('external'), setNow('updated_at')],
    patch: [disallow('external'), setNow('updated_at')],
    remove: [disallow('external')]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      alterItems(result => {
        result.id = result._id;
        delete result._id;
      }),
      ({ app, result, params }) => {
        if (!app.get('isCrawlerDisabled')) {
          const connection = params.connection;
          const simplecrawler = app.service('simplecrawler');
          if (simplecrawler) simplecrawler.create(result, { connection });
        }
      }
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
