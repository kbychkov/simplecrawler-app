import React, { Component } from 'react';
import './CrawlerStats.css';

export default class CrawlerStats extends Component {
  countItems(code) {
    let count = 0;
    this.props.data.forEach(item => {
      if (code === '2xx' && item.stateData.code >= 200 && item.stateData.code < 300) count++;
      if (code === '3xx' && item.stateData.code >= 300 && item.stateData.code < 400) count++;
      if (code === '4xx' && item.stateData.code >= 400 && item.stateData.code < 500) count++;
      if (code === '5xx' && item.stateData.code >= 500) count++;
    });
    return count;
  }

  render() {
    return (
      <div className="CrawlerStats">
        <div className="CrawlerStats-header">
          Crawl Stats
        </div>
        <div className="CrawlerStats-item">
          2xx - {this.countItems('2xx')}
        </div>
        <div className="CrawlerStats-item">
          3xx - {this.countItems('3xx')}
        </div>
        <div className="CrawlerStats-item">
          4xx - {this.countItems('4xx')}
        </div>
        <div className="CrawlerStats-item">
          5xx - {this.countItems('5xx')}
        </div>
      </div>
    );
  }
}
