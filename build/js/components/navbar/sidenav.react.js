import React, {Component} from 'react';
import { Link } from 'react-router';
import './sidebar.css';
import firebase from 'firebase';

export default class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    }
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        this.setState({email: user.email })
      }
    });
  }

  render() {
    const activeStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0.05)'
    }
    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>anthony.wang@me.com</h1>
        </div>
        <div className="divider"></div>
        <ul>
          <li><Link to="/app" activeStyle={activeStyle}><i className="fa fa-home" aria-hidden="true"></i> Home</Link></li>
          <li><Link to="/bookmarx" activeStyle={activeStyle}><i className="fa fa-bookmark" aria-hidden="true"></i> Bookmarks</Link></li>
          <li><Link to="/weather" activeStyle={activeStyle}><i className="fa fa-sun-o" aria-hidden="true"></i> Weather</Link></li>
          <li><Link to="/packages" activeStyle={activeStyle}><i className="fa fa-archive" aria-hidden="true"></i> Packages</Link></li>
          <li><Link to="/todos" activeStyle={activeStyle}><i className="fa fa-check-square-o" aria-hidden="true"></i> Todos</Link></li>
        </ul>
        <ul className="bottom-nav">
          <li><button><i className="fa fa-cog" aria-hidden="true"></i> Settings</button></li>
        </ul>
      </div>
    );
  }
}
