import React, { Component } from 'react';
import './Crawler.css';
import CrawlerLog from './CrawlerLog';
import CrawlerStats from './CrawlerStats';
import TextInput from './TextInput';
import Button from './Button';

import io from 'socket.io-client';
import socketio from '@feathersjs/socketio-client';
import feathers from '@feathersjs/client';

export default class Crawler extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      log: []
    };

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const socket = io(process.env.REACT_APP_API_URL, {transports: ['websocket']});

    this.app = feathers();
    this.app.configure(socketio(socket));

    const crawler = this.app.service('simplecrawler');

    crawler.on('fetchheaders', this.handleFetchHeaders.bind(this));

    crawler.on('complete', data => {
      console.log('complete', data);
    });
  }

  handleFetchHeaders(data) {
    this.setState(state => ({
      log: [...state.log, data]
    }));
  }

  handleQueryChange({ value }) {
    this.setState({ query: value });
  }

  handleSubmit(event) {
    this.setState({ log: [] });
    this.app.service('api/crawlers').create({ query: this.state.query });

    event.preventDefault();
  }

  render() {
    return (
      <div className="Crawler">
        <form className="Crawler-form" onSubmit={this.handleSubmit}>
          <TextInput onUpdate={this.handleQueryChange} />
          <div className="Crawler-submit">
            <Button type="submit">start</Button>
          </div>
        </form>
        <div className="Crawler-example">
          <strong>Example:</strong> <span title="The initial URL to start crawl">http://example.com</span> <span title="Define a max depth of crawl from the starting page">depth:2</span> <span title="Max number of pages to crawl">limit:10</span>
        </div>
        <div className="Crawler-container">
          <div className="Crawler-log">
            <CrawlerLog data={this.state.log} />
          </div>
          <div className="Crawler-stats">
            <CrawlerStats data={this.state.log} />
          </div>
        </div>
      </div>
    );
  }
}
