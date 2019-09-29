import React, { Component } from 'react'
import ReactGA from 'react-ga';
import './App.css';
import Header from './Header';
import Crawler from './Crawler';

export default class App extends Component {
  componentDidMount() {
    if (process.env.REACT_APP_TRACKING_ID) {
      ReactGA.initialize(process.env.REACT_APP_TRACKING_ID);
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Crawler />
      </div>
    )
  }
}
