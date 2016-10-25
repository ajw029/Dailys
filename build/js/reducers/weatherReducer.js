import * as types from '../constants/ActionTypes';

const nth = (d) => {
  if(d>3 && d<21) return 'th';
  switch (d % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
  }
}

const createInitialState = () => {
  const objToday = new Date();
  // Day Of Week
  const weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
  const dayOfWeek = weekday[objToday.getDay()];

  // Month
  const months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
  const curMonth = months[objToday.getMonth()];

  // Year
  const year = objToday.getFullYear();

  // Day
  const day = objToday.getDate();
  const nthDay = nth(day);

  const hour = objToday.getHours();
  const todayParsed = year+"."+objToday.getMonth()+"."+day+"."+hour;
  return {
    isFetching: false,
    didInvalidate: false,
    weather: {},
    calendar: {
      date: curMonth + "\t" +day+nthDay,
      dayOfWeek: dayOfWeek,
    },
    showF: true,
    displayedTemp: 0,
    showMore: false,
    searchResults: []
  };
}

const initialState = createInitialState();

export default function Weather(state = initialState, action) {
  switch (action.type) {
    case types.GET_WEATHER:
      return {
        ...state
      };
    case types.SAVE_WEATHER:
      return {
        ...state,
        weather: action.weather
      };
    default:
      return state;
  }
};
