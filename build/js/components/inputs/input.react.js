import React, {Component} from 'react';
import classNames from 'classnames';

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVal: ''
    }
  }

  onChange = (name, event) => {
    this.props.onChange(name, event.target.value);
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter' && this.props.handleEnter) {
      this.props.handleEnter();
    }
  }

  render = () => {
    const name = this.props.name || "" ;
    return (
      <div className="inputgroup">
        <input name={name} type={this.props.type || "text"} value={this.props.inputVal} onChange={ this.onChange.bind(this, name) } required/>
        <span className="bar"></span>
        <label>{this.props.placeholder || ""}</label>
      </div>
    );
  }

}
