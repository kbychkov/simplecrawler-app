const MongoQueue = require('simplecrawler-mongo-queue');

class Queue extends MongoQueue {
  constructor(datastore, name) {
    super(datastore, name);
  }

  static async create(datastore, name) {
    const queue = await MongoQueue.create.call(this, datastore, name);
    return new Promise((resolve, reject) => {
      queue.getLength((err) => {
        if (!err) {
          resolve(queue);
        } else {
          reject(err);
        }
      });
    });
  }

  add(queueItem, force, callback) {
    this.length++;
    super.add(queueItem, force, (err, result) => {
      if (!err) {
        callback(null, result);
      } else {
        this.length--; // the dirty hack but don't have to refactor simplecrawler
        callback(err);
      }
    });
  }

  getLength(callback) {
    if (!this.length) {
      super.getLength((err, result) => {
        if (!err) {
          this.length = result;
          callback(null, this.length);
        } else {
          callback(err);
        }
      });
    } else {
      callback(null, this.length);
    }
  }
}

module.exports = Queue;
