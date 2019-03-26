import React from 'react'
import './loginform.scss'

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.submit(this.email.value, this.password.value)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} method="POST">
        <label for="email_address">Email:</label>
        <input 
          type="email"
          id="email_address"
          name="username"
          ref={(input) => { this.email = input; }}
        />
        
        <label for="password">Password:</label>
        <input 
          type="password"
          name="password"
          id="password"
          ref={(input) => { this.password = input; }}
        />

        <button type="submit">Submit</button>
      </form>
    )
  }
}
