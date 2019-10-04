import React, { Component } from 'react';
import './Button.css';

export default class Button extends Component {
  render() {
    return (
      <button className="Button" type="{this.props.submit}">
        {this.props.children}
      </button>
    )
  }
}
