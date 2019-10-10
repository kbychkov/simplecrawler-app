delete require.cache[require.resolve('../../server/app')];

const assert = require('assert');
const app = require('../../server/app');
const path = require('path');
const {TestServer} = require('@pptr/testserver');
const AppServer = require('../fixtures/appserver');
const io = require('socket.io-client');

const discover = require('../../server/services/simplecrawler/discover');
const fs = require('fs');

describe('\'simplecrawler\' service', () => {
  let appServer, testServer;

  before(async () => {
    const root = path.join(__dirname, '../assets');
    testServer = await TestServer.create(root, 8000);
    appServer = await AppServer.create(app);
  });

  after(async () => {
    await testServer.stop();
    await appServer.stop();
  });

  it('registered the service', () => {
    const service = app.service('simplecrawler');

    assert.ok(service, 'Registered the service');
  });

  it('emits `complete` event', done => {
    const simplecrawler = app.service('simplecrawler');

    simplecrawler.once('complete', () => done());

    simplecrawler.create({ url: 'http://localhost:8000' });
  });

  it('emits `fetchheaders` event', done => {
    const simplecrawler = app.service('simplecrawler');

    simplecrawler.once('fetchheaders', message => {
      assert.ok(typeof message === 'object');
      simplecrawler.once('complete', () => done());
    });

    simplecrawler.create({ url: 'http://localhost:8000' });
  });

  it('sends events to only the initiator', function (done) {
    const client1 = io(appServer.getUrl());
    const client2 = io(appServer.getUrl());
    let count = 0;

    client2.on('simplecrawler fetchheaders', () => {
      assert.ok(false, 'Should never get here');
    });

    client1.on('simplecrawler fetchheaders', () => {
      count++;
    });

    client1.on('simplecrawler complete', () => {
      assert.ok(count > 0);
      client1.close();
      client2.close();
      done();
    });

    client1.emit('create', 'api/crawlers', { url: 'http://localhost:8000' });
  });
});

describe('discover resources', () => {
  it('extracts all links from HTML', () => {
    const buffer = fs.readFileSync('test/assets/discover.html', 'utf8');
    const queueItem = {
      stateData: {
        contentType: 'text/html'
      }
    };
    const result = discover(buffer, queueItem);

    assert.ok(Array.isArray(result));
    assert.equal(result.length, 5);
    assert.equal(result[0], 'main.css');
    assert.equal(result[1], 'main.js');
    assert.equal(result[2], 'myfile.html');
    assert.equal(result[3], 'index.html');
    assert.equal(result[4], 'image.jpg');
  });

  it('extracts all links from XML', () => {
    const buffer = fs.readFileSync('test/assets/sitemap.xml', 'utf8');
    const queueItem = {
      stateData: {
        contentType: 'text/xml'
      }
    };
    const result = discover(buffer, queueItem);

    assert.ok(Array.isArray(result));
    assert.equal(result[0], 'http://localhost:3030');
  });
});
