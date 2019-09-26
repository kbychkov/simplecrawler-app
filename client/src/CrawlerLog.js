import React, { Component } from 'react';
import './CrawlerLog.css';
import CrawlerLogItem from './CrawlerLogItem';

export default class CrawlerLog extends Component {
  render() {
    const logItems = this.props.data.map(item =>
      <CrawlerLogItem key={item.id} data={item} />
    );

    return (
      <div className="CrawlerLog">
        {logItems}
      </div>
    );
  }
}
