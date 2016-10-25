import React, {Component} from 'react';

/* Widgets */

import SideBar from './navbar/sidenav.react';

export default class HomeContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div>
      <SideBar/>
      <div className="mainContent">
        {this.props.children}
      </div>
    </div>
    );
  }
}
