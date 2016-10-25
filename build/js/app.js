import React from 'react';
import {render} from 'react-dom';

/* Views */
import App from './components/AppView.react';
import MainApp from './MainApp.react'

import LoginPage from './components/accounts/login.react';
import SignupPage from './components/accounts/signup.react';
import HomeContainer from './components/Home.react';
import BookmarksPage from './components/bookmarks/Bookmarx.react'

/* Redux + React-Router Compatibility */
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

/* State Container */
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import * as reducers from './reducers/index.js'

/* Router */
import { browserHistory, Router, Route, IndexRoute } from 'react-router';

// Reducers
const reducer = combineReducers({
  ...reducers,
  routing: routerReducer
});

const store = createStore(
  reducer,
  applyMiddleware(thunkMiddleware)
);
const history = syncHistoryWithStore(browserHistory, store)

render((
  <Provider store={store}>
    <div>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={LoginPage}/>
        <Route path="/" component={HomeContainer}>
          <Route path="/app" name="home" component={MainApp}></Route>
          <Route path="/bookmarx" name="bookmarx" component={BookmarksPage}></Route>
        </Route>
        <Route path="/login" name="login" component={LoginPage}></Route>
        <Route path="/signup" name="signup" component={SignupPage}></Route>
      </Route>
    </Router>
    </div>
  </Provider>)
  ,
  document.getElementById('root')
);
