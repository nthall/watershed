import React from 'react'
import User from '../../classes/User'
import Queue from '../Queue/Queue'
import LoginForm from '../LoginForm/LoginForm'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {user: false}
    let auth_str = localStorage.getItem('auth')
    if (auth_str !== null) {
      this.state.user = new User(JSON.parse(auth_str))
    }
    this.submitLogin = this.submitLogin.bind(this)
  }

  processLogin(response) {
    localStorage.setItem('auth', JSON.stringify(response))
    this.setState({'user': new User(response)})
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

  render() {
    return (
      <div>
        <div id="container">
          {this.state.user ? <Queue user={this.state.user} /> : <LoginForm login={this.submitLogin} />}
        </div>
      </div>
    )
  }
}
