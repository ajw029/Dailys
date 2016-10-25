import React, {Component} from 'react';
import classNames from 'classnames';

class MyEvent extends Component {
  constructor(props) {
    super(props);
  }
  render = () => {
    return (
      <li>
        <div>
          <h1></h1>
          <h2></h2>
          <h3></h3>
        </div>
      </li>
    );
  }
};

export default class ScheduleWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      showSettings: false,
      addingSchedule: false,
    }
  }

  toggleScheduleSettings = () => {
    this.state({showSettings: !this.state.showSettings});
    console.log(this.state.toggleScheduleSettings)
  }

  refreshScheduleSettings = () => {
  }

  toggleScheduleSettings = () => {
  }

  addNewTodo = () => {
  }

  handleAuthClick = () => {
  }

  render = () => {
     var i = 0;
     const events = (this.state.events || []);
    //  const MyEvents = (events).map(function(event) {
    //    i++;
    //    return (
    //      <MyEvent
    //       title={event.title}
    //       id={i}
    //       key={i}
    //     />)
    // }.bind(this));

    const expandedHeight = 148 * (events.length - 1);
    const ctrStyle = {
      height: 276 + expandedHeight + 'px'
    };

    const center_style = {'textAlign':'center'};
    return (



      <div id="schedule_outerContainer" className="bookmark schedule" style={ctrStyle}>
        <div id="schedule_scheduleAddContainer" className={classNames('todoAddContainer', {hide: !this.state.showSettings})}>
          <div className="todoAddInnerContainer">
            <button className="closeButton" onClick={this.toggleScheduleSettings}><img src="/img/ic_close_black_48dp_2x.png"  alt="x"></img></button>
            <h1 id="todo_view_Title">Settings</h1>
            <div className="flatButtonContainer">
              <h3>Connect to Google Calendar</h3>
              <button id="authorize-button" className="flatSquareButton" onClick={this.handleAuthClick}>Authorize</button>
            </div>
          </div>
        </div>
        <div className={classNames({hide: this.state.showSettings})}>
          <h1>Todays Schedule</h1>
          <button className="refresh_button" onClick={this.refreshScheduleSettings}><img src="/img/ic_refresh_black_48dp_2x.png" alt="x"></img></button>
          <button className="settings_button" onClick={this.toggleScheduleSettings}><img src="/img/ic_more_vert_black_48dp_2x.png"  alt="x"></img></button>
          <div className="todoScheduleContainer">
            <ul>
            </ul>
            <button className="fab hide" onClick={this.addNewTodo}><img src="/img/ic_add_white_48dp_2x.png" alt="plus"></img></button>
          </div>
        </div>
      </div>
    );
  }
}
