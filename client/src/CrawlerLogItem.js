import React, { Component } from 'react';
import './CrawlerLogItem.css';

export default class CrawlerLogItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };

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

    this.toggleItem = this.toggleItem.bind(this);
  }

  toggleItem() {
    this.setState(state => ({
      isOpen: !state.isOpen
    }));
  }

  getItemModifier() {
    return this.state.isOpen ? 'CrawlerLogItem--open' : '';
  }

  render() {
    const headers = this.props.data.stateData.headers;
    const headersItems = Object.keys(headers).map(key => (
      <li key={key}><span>{key}:</span> {headers[key]}</li>
    ));

    return (
      <div className={'CrawlerLogItem ' + this.getItemModifier()}>
        <div className="CrawlerLogItem-url" onClick={this.toggleItem}>
          {this.props.data.url}
        </div>
        <div className={'CrawlerLogItem-code ' + this.crawlerLogItemModifier}>
          {this.props.data.stateData.code}
        </div>
        <dl className="CrawlerLogItem-details">
          <dt className="CrawlerLogItem-detailsTitle">depth</dt>
          <dd className="CrawlerLogItem-detailsData">{this.props.data.depth}</dd>
          <dt className="CrawlerLogItem-detailsTitle">referrer</dt>
          <dd className="CrawlerLogItem-detailsData">{this.props.data.referrer}</dd>
          <dt className="CrawlerLogItem-detailsTitle">headers</dt>
          <dd className="CrawlerLogItem-detailsData">
            <ul className="CrawlerLogItem-headers">
              {headersItems}
            </ul>
          </dd>
        </dl>
      </div>
    );
  }
}
