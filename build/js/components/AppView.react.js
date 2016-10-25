import React, {Component} from 'react';
import NavBar from './navbar/navbar.react';
import '../styles/style.css';
import '../styles/font-awesome.css';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <NavBar/>
        {this.props.children}
      </div>
    );
  }
}
