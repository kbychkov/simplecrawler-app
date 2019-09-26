import React, { Component } from 'react'
import './Header.css';
import version from './version';

export default class Header extends Component {
  render() {
    return (
      <div className="Header">
        <div className="Header-logo"><strong>simplecrawler-app</strong> v{version}</div>
        <div className="Header-text">The GUI for <a href="https://github.com/simplecrawler/simplecrawler">Simplecrawler</a> - flexible event driven crawler for Node.js</div>
        <div className="Header-github">
          <a href="https://github.com/kbychkov/simplecrawler-app">The project on GitHub</a>
        </div>
      </div>
    );
  }
}
