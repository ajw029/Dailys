import React, {Component} from 'react';
import { Link } from 'react-router';
import './navbar.css';

export default class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav>
        <ul className="nav-title">
          <li><Link to="/">BookMarx</Link></li>
        </ul>
      </nav>
    );
  }
}
