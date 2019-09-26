import React, { Component } from 'react';
import './CrawlerLogItem.css';

export default class CrawlerLogItem extends Component {
  constructor(props) {
    super(props);

    this.crawlerLogItemModifier = '';
    const { code } = props.data.stateData;

    if (code >= 200 && code < 300) {
      this.crawlerLogItemModifier = 'CrawlerLogItem-code--2xx';
    } else if (code >= 300 && code < 400) {
      this.crawlerLogItemModifier = 'CrawlerLogItem-code--3xx';
    } else if (code >= 400 && code < 500) {
      this.crawlerLogItemModifier = 'CrawlerLogItem-code--4xx';
    } else if (code >= 500) {
      this.crawlerLogItemModifier = 'CrawlerLogItem-code--5xx';
    }
  }

  render() {
    return (
      <div className="CrawlerLogItem">
        <div className="CrawlerLogItem-url">
          {this.props.data.url}
        </div>
        <div className={'CrawlerLogItem-code ' + this.crawlerLogItemModifier}>
          {this.props.data.stateData.code}
        </div>
      </div>
    );
  }
}
