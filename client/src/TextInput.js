import React, { Component } from 'react';
import './TextInput.css';

export default class TextInput extends Component {
  constructor(props) {
    super(props);
    let value = '';

    if (props.value) {
      value = props.value;
    } else if (props.defaultValue) {
      value = props.defaultValue;
    }

    this.state = {
      value
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;

    this.setState({
      value
    });

    if (this.props.onUpdate) {
      this.props.onUpdate({ value });
    }
  }

  render() {
    return (
      <input
        className="TextInput"
        type="text"
        value={this.state.value}
        onChange={this.handleChange}
      />
    )
  }
}
