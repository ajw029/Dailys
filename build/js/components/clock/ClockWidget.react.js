import React, {Component} from 'react';
import './clock.css';

export default class ClockWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hour_next: '00',
      hour_top: '00',
      hour_flip_back: '00',
      hour_flip_bottom: '00',
      min_next:'00',
      min_top:'00',
      min_flip_back: '00',
      min_flip_bottom: '00',
      am_pm: 'am',
      hourHandFlip: '',
      minHandFlip: ''
    }
  }

  leftPad = (number, targetLength) => {
    let output = number + '';
    while (output.length < targetLength) {
      output = '0' + output;
    }
    return output;
  }

  setHand = (newTime, isHour) => {
      let oldVal;
      if (isHour) {
        oldVal = parseInt(this.state.hour_top);
      }
      else {
        oldVal = parseInt(this.state.min_top);
      }
      if (isHour) {
        let isPM = false;
        if (newTime==0) {
          newTime = 12;
        }
        else if (newTime>=12) {
          newTime-= 12;
          if (newTime == 0) {
            newTime = 12;
          }
          isPM = true;
        }
        this.setState({am_pm: isPM ? 'pm' : 'am'});
      }
      // Flip
      if ((oldVal) != newTime) {
        this.animateFlip(newTime, isHour);
      }
  }

  removeFlip2 = (hand, newTime, isHour) => {
    //$(hand).find('.flip--top').eq(0).removeClass('flipTopAnimation');
    //$(hand).find('.flip--back').eq(0).removeClass('flipBackAnimation');
    if (isHour) {
      var left_pad_val = this.leftPad(newTime,2);
      this.setState({
        hour_next: left_pad_val,
        hour_flip_back: left_pad_val,
        hour_flip_bottom: left_pad_val
      });
    }
    else {
      this.setState({
        min_next: this.leftPad(newTime,2),
        min_flip_back: this.leftPad(newTime,2),
        min_flip_bottom: this.leftPad(newTime,2)
      });
    }
  }
  removeFlip = (hand, newTime, isHour) => {
    //$(hand).find('.flip--back').eq(0).addClass('flipBackAnimation');


    if (isHour) {
      this.setState({
        hour_top: this.leftPad(newTime,2),
      });
    }
    else {
      this.setState({
        min_top: this.leftPad(newTime,2),
      });
    }

    setTimeout(function(){
      var hand_ = hand;
      var newTime_ = newTime;
      var isHour_ = isHour;
      this.removeFlip2(hand_, newTime_, isHour_);
    }.bind(this), 350);
  }

  animateFlip = (newTime, isHour) => {

    let hand;
    if (isHour) {
      this.setState({hourHandFlip: {flipTopAnimation: true }});
    }
    else {
      this.setState({hourHandFlip: {flipTopAnimation: true} });
    }

    var bottomClock = parseInt(newTime)-1;
    if (bottomClock<0) {
       bottomClock = 0;
    }
    if (isHour) {
      this.setState({
        hour_next: this.leftPad(newTime,2),
        hour_flip_back: this.leftPad(newTime,2),
        hour_top: this.leftPad(bottomClock,2),
        hour_flip_bottom: this.leftPad(bottomClock,2)
      });
    }
    else {
      this.setState({
        min_next: this.leftPad(newTime,2),
        min_flip_back: this.leftPad(newTime,2),
        min_top: this.leftPad(bottomClock,2),
        min_flip_bottom: this.leftPad(bottomClock,2)
      });
    }

    setTimeout(function() {
      var hand_ = hand;
      var newTime_ = newTime;
      var isHour_ = isHour;
      this.removeFlip(hand_, newTime_, isHour_);
    }.bind(this), 350);

  }

  setupClock = () => {
    let currentDate = new Date();
    this.setHand(parseInt(currentDate.getHours()), true);
    this.setHand(parseInt(currentDate.getMinutes()), false);
  }

  componentDidMount = () => {
    this.setupClock();
    this._timer = setInterval(this.setupClock, 1000);
  }


  render = () => {
    return (
      <div className="bookmark clock">
        <div className="bookmarks_clock">
          <div className="seg">
            <div id="clock_hourHand" className={this.state.hourHandFlip}>
              <div className="flip-wrapper">
                <div className="flip flip--next">{this.state.hour_next}</div>
                <div className="flip flip--top">{this.state.hour_top}</div>
                <div className="flip flip--top flip--back">{this.state.hour_flip_back}</div>
                <div className="flip flip--bottom">{this.state.hour_flip_bottom}</div>
              </div>

            </div>
            <div id="clock_minuteHand" className={this.state.minHandFlip}>
              <div className="flip-wrapper">
                <div className="flip flip--next">{this.state.min_next}</div>
                <div className="flip flip--top">{this.state.min_top}</div>
                <div className="flip flip--top flip--back">{this.state.min_flip_back}</div>
                <div className="flip flip--bottom">{this.state.min_flip_bottom}</div>
                <div className="ampm">{this.state.am_pm}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
