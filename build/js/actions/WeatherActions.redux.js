import * as types from '../constants/ActionTypes';
import { get, post } from '../tools/httpModule';

export function saveWeather(weather) {
  return { type: types.SAVE_WEATHER, weather }
}

export const requestWeather = (location) => ({
  type: types.GET_WEATHER,
  location
});

export const receiveWeather = (location, json) =>  {
  return {
    type: types.RECEIVE_WEATHER,
    location,
    weather: json,
    receivedAt: Date.now()
  };
}

const fetchWeather = location => dispatch => {
  dispatch(requestWeather(location));
  let link = 'http://localhost:8080/api/getweather';

  let geoInfo = {};
  return get('http://ipinfo.io')
  .then( response => {
    geoInfo.timestamp = new Date();
    geoInfo.geo = response.city;
    geoInfo.postal = response.postal;
  })
  .then( get.bind(null, link, geoInfo) )
  .then( (response) => {
    response.city = geoInfo.geo;
    dispatch(saveWeather(response));
    return response;
  })
  .then(json => dispatch(receiveWeather(location, json)))
  .catch (err => {
    console.log('err:', err)
  })
}

const shouldFetchWeather = (state, location) => {

  const weatherState = state.weatherReducer[location];

  if (!weatherState) {
    return true
  }
  if (weatherState.isFetching) {
    return false
  }
  return weatherState.didInvalidate
}

export const fetchWeatherIfNeeded = location => (dispatch, getState) => {
  if (shouldFetchWeather(getState(), location)) {
    return dispatch(fetchWeather(location))
  }
}
