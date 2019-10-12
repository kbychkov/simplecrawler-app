const assert = require('assert');
const app = require('../../server/app');

describe('\'crawlers\' service', () => {
  before(() => {
    app.set('isCrawlerDisabled', true);
    return app.get('mongoClient');
  });

  after(() => {
    app.set('isCrawlerDisabled', false);
  });

  it('registered the service', () => {
    const service = app.service('api/crawlers');

    assert.ok(service, 'Registered the service');
  });

  it('disallows external `find` calls', async () => {
    try {
      const params = { provider: 'rest' };
      await app.service('api/crawlers').find(params);
      assert.ok(false, 'Should never get here');
    } catch (e) {
      assert.equal(e.name, 'MethodNotAllowed');
    }
  });

  it('disallows external `update` calls', async () => {
    try {
      const params = { provider: 'rest' };
      await app.service('api/crawlers').update(0, {}, params);
      assert.ok(false, 'Should never get here');
    } catch (e) {
      assert.equal(e.name, 'MethodNotAllowed');
    }
  });

  it('disallows external `patch` calls', async () => {
    try {
      const params = { provider: 'rest' };
      await app.service('api/crawlers').patch(0, {}, params);
      assert.ok(false, 'Should never get here');
    } catch (e) {
      assert.equal(e.name, 'MethodNotAllowed');
    }
  });

  it('disallows external `remove` calls', async () => {
    try {
      const params = { provider: 'rest' };
      await app.service('api/crawlers').remove(0, params);
      assert.ok(false, 'Should never get here');
    } catch (e) {
      assert.equal(e.name, 'MethodNotAllowed');
    }
  });

  it('returns an id for newly created crawler', async () => {
    const result = await app.service('api/crawlers').create({
      url: 'http://example.com'
    });

    assert.ok(result.id, 'id undefined');
  });

  it('discards `_id` in the response', async () => {
    const result = await app.service('api/crawlers').create({
      url: 'http://example.com'
    });

    assert.ok(!result._id);
  });
});
