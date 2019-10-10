const cheerio = require('cheerio');

const htmlRules = [{
  selector: 'link[rel="stylesheet"]',
  attribute: 'href'
}, {
  selector: 'script',
  attribute: 'src'
}, {
  selector: 'link[rel="import"]',
  attribute: 'href'
}, {
  selector: 'link[rel="preload"][as="style"]',
  attribute: 'href'
}, {
  selector: 'a',
  attribute: 'href'
}, {
  selector: 'img',
  attribute: 'src'
}];

module.exports = (buffer, queueItem) => {
  const { contentType } = queueItem.stateData;
  const $ = cheerio.load(buffer);

  if (contentType.startsWith('text/html')) {
    return htmlRules.reduce((result, rule) => {
      const data = $(rule.selector).map((i, el) => $(el).attr(rule.attribute)).toArray();
      return result.concat(data);
    }, []);
  }

  if (contentType.startsWith('text/xml')) {
    return $('loc').map((i, el) => $(el).text()).toArray();
  }

  return [];
};
