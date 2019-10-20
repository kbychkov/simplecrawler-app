/* eslint-disable no-unused-vars */
const Simplecrawler = require('simplecrawler');
const Queue = require('./queue');
const discover = require('./discover');
const { version } = require('../../../package.json');

class Service {
  constructor (options) {
    this.options = options || {};
    this.events = ['fetchheaders', 'complete'];
  }

  async setup(app, path) {
    this.app = app;
    this.db = await app.get('mongoClient');
    this.collection = this.db.collection('queues');
  }

  async create (data, params) {
    const { id, url, depth, limit, queue_id } = data;
    const { connection } = params;

    const crawler = new Simplecrawler(url);

    crawler.queue = await Queue.create(this.collection, queue_id);
    crawler.maxDepth = depth;
    crawler.userAgent = `Simplecrawler/${version} (+https://simplecrawler.app)`;
    crawler.discoverResources = discover;

    crawler.addFetchCondition((queueItem, referrerQueueItem, callback) => {
      crawler.queue.getLength((err, length) => {
        callback(null, !(length >= limit));
      });
    });

    crawler.on('crawlstart', async () => {
      await this.app.service('api/crawlers').patch(id, {
        status: 'in_progress'
      });
    });

    crawler.on('fetchheaders', queueItem => {
      const data = { ...queueItem, connection };
      this.emit('fetchheaders', data);
    });

    crawler.on('complete', async () => {
      const data = { connection };
      this.emit('complete', data);
      await this.app.service('api/crawlers').patch(id, {
        status: 'completed',
        finished_at: new Date()
      });
    });

    crawler.start();

    return {
      id: crawler.queue.name
    };
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
