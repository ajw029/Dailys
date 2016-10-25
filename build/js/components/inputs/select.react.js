import React, {Component} from 'react';
import classNames from 'classnames';

class Option extends Component {
  constructor(props) {
    super(props);
  }
  render = () => {
    return (
      <option>{this.props.value}</option>
    );
  }
}

export default class Dropdown extends Component {
  constructor(props) {
    super(props);

    let initVal;
    if ( ( this.props.options || [] ).length > 0 ) {
      initVal = this.props.options[0].value;
    }

    const initialValue = initVal || '';

  }

  onChange = (event) => {
      this.props.onChange(this.props.name, event.target.value);

  }

  render = () => {
    const label = this.props.label || "";

    const options = ( this.props.options || []).map( (option) => {
      return <Option
              key={option.value}
              label={option.label}
              value={option.value}
              />
    })

    return (
      <div>
        <div className="labelgroup">
          <label>{label}</label>
        </div>
        <div className="inputselect">
          <select onChange={this.onChange.bind(this)} value={this.props.input}>
            {options}
          </select>
        </div>
      </div>
    );
  }

}
