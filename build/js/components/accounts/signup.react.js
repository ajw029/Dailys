import React, {Component} from 'react';

/* Router */
import { browserHistory, Link } from 'react-router';
import Input from '../inputs/input.react.js';
import firebase from 'firebase';


export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      repassword: ''
    }
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

  login = () => {
    if (this.validateLogin()) {
      firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password)
      .then(function() {
        browserHistory.push('/app')
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error)
      });

    }
  }
  switchToLogin = () => {
    console.log('here')
    browserHistory.push('/login');
  }

  render() {
    return (
      <section className="slide">
        <div className="formcontainer column-40">
          <form>
            <h1>Sign Up</h1>
            <div className="inputgroup">
              <span className="errMsg hide">Could Not Login</span>
            </div>

            <Input
              placeholder={'Username'}
              name={'username'}
              type={'text'}
              onChange={this.inputOnChange}
            />
            <Input
              placeholder={'Password'}
              name={'password'}
              type={'password'}
              onChange={this.inputOnChange}
            />
            <Input
              placeholder={'Retype Password'}
              name={'repassword'}
              type={'password'}
              onChange={this.inputOnChange}
            />

            <div className="inputgroup">
              <button type="button" className="boxButton okayButton" onClick={this.login}>Sign Up</button>
              <h2 className="noaccountlabel">Already got an account?</h2>
              <button className="boxButton cancelButton" onClick={this.switchToLogin}>Login</button>

            </div>
          </form>
        </div>
      </section>
    );
  }
}
