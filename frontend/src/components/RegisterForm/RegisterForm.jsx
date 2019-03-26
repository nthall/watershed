import React from 'react'

export default class RegisterForm extends React.Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.submit(this.email.value, this.password.value, this.password2.value)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} method="POST">
        <label for="email_address">Email:</label>
        <input 
          type="email"
          name="username"
          id="email_address"
          ref={(input) => { this.email = input; }}
        />

        <label for="password">Password:</label>
        <input 
          type="password"
          name="password"
          id="password"
          ref={(input) => { this.password = input; }}
        />

        <label for="confirm_password">Confirm Password:</label>
        <input 
          type="password"
          name="password2"
          id="confirm_password"
          ref={(input) => { this.password2 = input; }}
        />

        <button type="submit">Submit</button>
      </form>
    )
  }
}
