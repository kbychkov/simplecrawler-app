const simplecrawler = require('./simplecrawler/simplecrawler.service.js');
const crawlers = require('./crawlers/crawlers.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(simplecrawler);
  app.configure(crawlers);
};
