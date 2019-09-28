const assert = require('assert');
const rp = require('request-promise');
const io = require('socket.io-client');
const AppServer = require('./fixtures/appserver');
const app = require('../server/app');

describe('Feathers application tests', () => {
  let appServer;

  before(async () => {
    appServer = await AppServer.create(app);
  });

  after(async () => {
    await appServer.stop();
  });

  it('starts and shows the index page', () => {
    return rp(appServer.getUrl()).then(body =>
      assert.ok(body.indexOf('<html>') !== -1)
    );
  });

  it('shows a 404 HTML page', () => {
    return rp({
      url: appServer.getUrl('path/to/nowhere'),
      headers: {
        'Accept': 'text/html'
      }
    }).catch(res => {
      assert.equal(res.statusCode, 404);
      assert.ok(res.error.indexOf('<html>') !== -1);
    });
  });

  it('shows a 404 JSON error without stack trace', () => {
    return rp({
      url: appServer.getUrl('path/to/nowhere'),
      json: true
    }).catch(res => {
      assert.equal(res.statusCode, 404);
      assert.equal(res.error.code, 404);
      assert.equal(res.error.message, 'Page not found');
      assert.equal(res.error.name, 'NotFound');
    });
  });

  it('exposes socket id into connection object', done => {
    app.on('connection', connection => {
      assert.ok(connection.id);
      socket.close();
      done();
    });

    const socket = io(appServer.getUrl());
  });
});
