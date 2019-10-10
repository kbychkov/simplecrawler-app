/* eslint-disable no-unused-vars */
const Simplecrawler = require('simplecrawler');
const MongoQueue = require('simplecrawler-mongo-queue');
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
    const { id, url, depth } = data;
    const { connection } = params;

    const crawler = new Simplecrawler(url);

    crawler.queue = await MongoQueue.create(this.collection, id);
    crawler.maxDepth = depth;
    crawler.userAgent = `Simplecrawler/${version} (+https://simplecrawler.app)`;
    crawler.discoverResources = discover;

    crawler.on('fetchheaders', queueItem => {
      const data = { ...queueItem, connection };
      this.emit('fetchheaders', data);
    });

    crawler.on('complete', () => {
      const data = { connection };
      this.emit('complete', data);
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
