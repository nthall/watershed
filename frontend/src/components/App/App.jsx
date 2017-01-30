import React from 'react'
import User from '../../classes/User'
import Queue from '../Queue/Queue'
import LoginOrRegister from '../LoginOrRegister/LoginOrRegister'

import style from './app.scss'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {user: false}
    let auth_str = localStorage.getItem('auth')
    if (auth_str !== null) {
      this.state.user = new User(JSON.parse(auth_str))
    }
    this.submitLogin = this.submitLogin.bind(this)
    this.submitRegister = this.submitRegister.bind(this)
    this.submitAuth = this.submitAuth.bind(this)
  }

  processLogin(response) {
    localStorage.setItem('auth', JSON.stringify(response))
    this.setState({'user': new User(response)})
  }

  submitAuth(username, password, password2) {
    if (typeof(password2) === 'undefined') {
      this.submitLogin(username, password)
    } else {
      this.submitRegister(username, password, password2)
    }
  }

  submitLogin(username, password) {
    $.ajax({
      context: this,
      method: "POST",
      url: '/authtoken/',
      data: JSON.stringify({
        username,
        password
      }),
      processData: false,
      dataType: 'json',
      contentType: 'application/json',
      success: this.processLogin
    })
  }

  submitRegister(username, password, password2) {
    $.ajax({
      context: this,
      method: "POST",
      url: '/register/',
      data: JSON.stringify({
        email_address: username,
        password,
        password2
      }),
      processData: false,
      dataType: 'json',
      contentType: 'application/json',
      success: this.processLogin
    })
  }

  render() {
    return (
      <div>
        <div id="container">
          {this.state.user ? <Queue user={this.state.user} /> : <LoginOrRegister submit={this.submitAuth} />}
        </div>
      </div>
    )
  }
}
