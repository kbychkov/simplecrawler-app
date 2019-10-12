const { isURL, isInt } = require('validator');
const errors = require('@feathersjs/errors');
const searchQuery = require('search-query-parser');
const shortid = require('shortid');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const defaults = {
      depth: 0
    };
    const data = Object.assign({}, defaults, context.data);

    if (data.query) {
      const options = {
        keywords: ['depth']
      };

      const parsed = searchQuery.parse(data.query, options);

      data.url = parsed.text;

      if (parsed.depth) {
        data.depth = parseInt(parsed.depth, 10);
      }
    }

    if (!data.url || !isURL(data.url, { require_protocol: true, require_tld: false })) {
      throw new errors.BadRequest('Invalid URL provided.');
    }

    if (!isInt(data.depth + '', { min: 0 })) {
      throw new errors.BadRequest('Depth should be a positive number.');
    }

    context.data = {
      url: data.url,
      depth: data.depth,
      queue_id: shortid.generate(),
      status: 'pending'
    };

    return context;
  };
};
