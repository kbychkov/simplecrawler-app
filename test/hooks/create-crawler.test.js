const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const createCrawler = require('../../server/hooks/create-crawler');

describe('\'create-crawler\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async create(data) {
        return data;
      }
    });

    app.service('dummy').hooks({
      before: createCrawler()
    });
  });

  it('throws an error when no URL specified', async () => {
    try {
      await app.service('dummy').create({});
      assert.ok(false, 'Should never get here');
    } catch (e) {
      assert.equal(e.message, 'Invalid URL provided.');
    }
  });

  it('throws an error for empty URL', async () => {
    try {
      await app.service('dummy').create({ url: '' });
      assert.ok(false, 'Should never get here');
    } catch (e) {
      assert.equal(e.message, 'Invalid URL provided.');
    }
  });

  it('throws an error for invalid URL', async () => {
    try {
      await app.service('dummy').create({ url: 'invalid' });
      assert.ok(false, 'Should never get here');
    } catch (e) {
      assert.equal(e.message, 'Invalid URL provided.');
    }
  });

  it('rejects an URL without a protocol', async () => {
    try {
      await app.service('dummy').create({ url: 'example.com' });
      assert.ok(false, 'Should never get here');
    } catch (e) {
      assert.equal(e.message, 'Invalid URL provided.');
    }
  });

  it('accepts any valid URL', async () => {
    const url = 'http://example.com';
    const result = await app.service('dummy').create({ url });

    assert.equal(result.url, url);
  });

  it('accepts `localhost` with a port number', async () => {
    const url = 'http://localhost:3030';
    const result = await app.service('dummy').create({ url });

    assert.equal(result.url, url);
  });

  it('recognizes `url` in query', async () => {
    const query = 'http://example.com';
    const result = await app.service('dummy').create({ query });

    assert.equal(result.url, 'http://example.com');
  });

  it('accepts `depth` parameter', async () => {
    const params = { url: 'http://example.com', depth: 1 };
    const result = await app.service('dummy').create(params);

    assert.equal(result.depth, 1);
  });

  it('throws an error when negative depth', async () => {
    try {
      const params = { url: 'http://example.com', depth: -1 };
      await app.service('dummy').create(params);
      assert.ok(false, 'Should never get here');
    } catch (e) {
      assert.equal(e.message, 'Depth should be a positive number.');
    }
  });

  it('recognizes `depth` in query', async () => {
    const query = 'http://example.com depth:1';
    const result = await app.service('dummy').create({ query });

    assert.equal(result.depth, 1);
  });

  it('drops any irrelevant parameters', async () => {
    const params = { url: 'http://example.com', outsider: true };
    const result = await app.service('dummy').create(params);

    assert.ok(!result.outsider);
  });

  it('returns the necessary attributes', async () => {
    const params = { url: 'http://example.com' };
    const result = await app.service('dummy').create(params);

    assert.ok(result._id);
    assert.ok(result.url);
    assert.ok(result.depth !== undefined);
    assert.ok(result.created_at instanceof Date);
    assert.ok(result.updated_at instanceof Date);
    assert.ok(result.status === 'pending');
  });
});
