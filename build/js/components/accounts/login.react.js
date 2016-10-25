import React, {Component} from 'react';

import './accounts.css';

/* Router */
import { browserHistory, Link } from 'react-router';
import Input from '../inputs/input.react.js';
import firebase from 'firebase';
import C from '../../constants/configs';
firebase.initializeApp(C.firebaseConfig);

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }
  componentDidMount = () => {
    this.checkIfLoggedIn();
  }
  inputOnChange = (name, val) => {
    let newState = this.state;
    newState[name] = val;
    this.setState(newState);
  }

  validateLogin = () => {
    const username = this.state.username;
    const password = this.state.password;
    let hasErrors = false;
    if (!username) {

    }
    else {

    }
    if (!password) {

    }
    else {

    }
    return !hasErrors;
  }

  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        browserHistory.push('/app');
      } else {
      }
    });
  }

  login = () => {
    if (this.validateLogin()) {
      firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password)
      .then(function() {
        browserHistory.push('/app');
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error)
      });

    }
  }

  switchToSignUp = () => {
    browserHistory.push('/signup');
  }

  render() {
    return (
      <section className="slide">
        <div className="formcontainer column-40">
          <div >
            <h1>Login</h1>
            <div className="inputgroup">
              <span className="errMsg hide">Could Not Login</span>
            </div>

            <Input
              placeholder={'Username'}
              name={'username'}
              type={'text'}
              inputVal={this.state.username}
              handleEnter={this.login}
              onChange={this.inputOnChange}
            />
            <Input
              placeholder={'Password'}
              name={'password'}
              type={'password'}
              inputVal={this.state.password}
              handleEnter={this.login}
              onChange={this.inputOnChange}
            />

            <div className="inputgroup">
              <button type="button" className="boxButton okayButton" onClick={this.login}>Login</button>
              <h2 className="noaccountlabel">Dont have an account?</h2>
              <button className="boxButton cancelButton" onClick={this.switchToSignUp}>Signup</button>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
