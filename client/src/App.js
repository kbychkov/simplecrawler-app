import React, { Component } from 'react'
import './App.css';
import Header from './Header';
import Crawler from './Crawler';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Crawler />
      </div>
    )
  }
}
