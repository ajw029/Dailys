import React, {Component} from 'react';
import ToggleDisplay from 'react-toggle-display';
import classNames from 'classnames';

/* Redux */
import {connect} from 'react-redux';
import { requestWeather, receiveWeather, fetchWeather, shouldFetchWeather, fetchWeatherIfNeeded } from '../../actions/WeatherActions.redux';

class OtherWeather extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <div className="moreweather morning">
      <div className="moreweatherInnerContainer">
      <h4>San Diego</h4>
      <h4>59&deg;</h4>
      <i className="wi wi-day-fog"></i>
      </div>
      </div>
    )
  }

}

class LocationResult extends Component {

  constructor(props) {
    super(props);
  }

  addLocation = () => {

  }

  render = () => {
    return (
      <li>
        <p>{this.props.name} (this.props.zipCode)</p>
        <button onClick={this.addLocation}>ADD</button>
      </li>
    )
  }
}

/* CSS */
import './weather.css';
import './weather-icons.css';
import './weather-icons-wind.css';

const mapStateToProps = (state) => {
  return {
    weather: state.weatherReducer,
    searchResults: state.weatherReducer.searchResults
  }
}

const mapDispatchToProps = (dispatch => {
  return {
    fetchWeather: () => {
      dispatch(fetchWeatherIfNeeded())
    }
  }
});

class WeatherWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addingLocation: false,
      showMore: false,
      showF: true,
      showMore: false,
      addSearchInput: ''
    }
  }
  componentDidMount = () => {
    this.props.fetchWeather();
  }

  /* State Togglers */
  changeToFah = () => {
    if (this.state.showF !== true) {
      this.setState({
        showF: !this.state.showF
      });
    }
  }

  changeToCel = () => {
    if ( this.state.showF === true) {
      this.setState({
        showF: !this.state.showF
      });
    }
  }

  findLocations = (event) => {
    const newVal = event.target.value;
    this.setState({addSearchInput: newVal})
    if (!newVal) {

    }
  }


  toggleWeather = () => {
    this.setState({showMore: !this.state.showMore});
  }

  addNewLocation = () => {
    this.setState({addingLocation: true, showMore: false });
  }

  closeAddLocation = () => {
    this.setState({addingLocation: false, showMore: false });
  }

  /* Render */
  render = () => {
    let temp_style= {color:'black'};
    let fDeg;
    const curAppState = this.props.weather;
    let button_label = 'MORE';
    if (this.state.showMore) {
      button_label = 'LESS';
    }

    //
    const searchResults = (this.props.searchResults || []);
    const searchResultsList = searchResults.map( (result) => {
      return (<LocationResult/>)
    });

    const weatherState = curAppState.weather;
    const calendarState = curAppState.calendar;
    const displayedTemp = (this.state.showF ? weatherState.feelslike_f : weatherState.feelslike_c ) || 0;
    const fahrenButton = classNames('temp_fah', {'active': this.state.showF});
    const celButton = classNames('temp_cel', {'active': !this.state.showF});

    let curWeatherIconClasses;
    if ( curAppState && Object.keys(curAppState).length > 0 ) {
      fDeg = curAppState.temp_f;
      const hour = new Date().getHours();

      if (hour >= 19 || hour < 6) {
        curWeatherIconClasses = classNames('wi',
          { 'wi-night-alt-cloudy': true }
        );
      }
      else {
        if (!weatherState.wx_desc) {

        }
        else {
          curWeatherIconClasses = classNames('wi',
            { 'wi-day-sunny': fDeg>70 ||  weatherState.wx_desc.indexOf('Sunny') > -1 },
            { 'wi-day-cloudy-windy': weatherState.winddir_deg >50 },
            { 'wi-rain': weatherState.wx_desc.indexOf('rain')> -1 || weatherState.wx_desc.indexOf('Light Rain')> -1  },
            { 'wi-lightning': weatherState.wx_desc.indexOf('thunder') > -1 },
          );
        }

      }
    }


    const myOtherWeatherList = this.state.showMore ? [] : [];
    let expandedHeight = 64 * ( (myOtherWeatherList.length  > 0 ? myOtherWeatherList.length : 0) );
    if (this.state.showMore)
      expandedHeight += 48;

    const ctrStyle = {
      height: 192 + expandedHeight + 'px'
    };

    const widgetSize = classNames('bookmark weather');
    return (
      <div className="weatherwidget">
        <div className='bookmark weather' style={ctrStyle}>
          <div className={classNames({'hide': this.state.addingLocation})} >
            <h1 id="w_monthAndDate">{calendarState.date}</h1>
            <h5 id="w_dayOfTheWeek">&nbsp;{calendarState.dayOfWeek}</h5>
            <h1 id="w_location">{weatherState.city}</h1>

            <div className="weathercontainer">
              <i className={curWeatherIconClasses}></i>
              <h2 id="weather_degrees">{parseInt(displayedTemp)}</h2>
              <div className="weatherOption">
                <h3 style={temp_style}>o</h3>

                <button className={fahrenButton} onClick={this.changeToFah}>F</button>
                <h3>/</h3>
                <button className={celButton} onClick={this.changeToCel}>C</button>
              </div>
            </div>
          </div>

          <div className={classNames({'hide': !this.state.showMore})} >
            <div className="weathercontainer-more">

              <div className="moreweather add_button">
                <div className="moreweatheraddButton" onClick={this.addNewLocation}>
                  <img src="/img/ic_add_white_48dp_2x.png" alt="plus"></img><span>Add New Location</span>
                </div>
              </div>
            </div>
          </div>

          <div className={classNames({'hide': !this.state.addingLocation})} >
            <h1>Adding Location</h1>
            <button className="closeButton" onClick={this.closeAddLocation}><img src="/img/ic_close_black_48dp_2x.png"  alt="x"></img></button>
            <div className="location-form">
              <input type="text" placeholder="Search Via City or Zip Code" className="location-search" value={this.state.addSearchInput} onChange={this.findLocations}></input><button className="location-button" onClick={this.findLocations}>FIND</button>
            </div>
            <ul className="location-searchResults">
              {searchResultsList}
            </ul>
            <button></button>
          </div>

        <div className={classNames({'hide': this.state.addingLocation})} >
          <div className="card__action-bar">
            <button className="card__button" onClick={this.toggleWeather}>{button_label}</button>
          </div>
        </div>

      </div>
    </div>
    );

  }
}

export default connect(mapStateToProps,mapDispatchToProps)(WeatherWidget);
