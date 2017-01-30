import React from 'react'

export default class RegisterForm extends React.Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(event) {
		event.preventDefault()
    this.props.submit(this._email.value, this._password.value, this._password2.value)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} method="POST">
        <label>
          Email:
          <input 
            type="email"
            name="username"
            ref={(input) => { this._email = input; }}
          />
        </label>
        <label>
          Password:
          <input 
            type="password"
            name="password"
            ref={(input) => {this._password = input; }}
          />
        </label>
        <label>
          Confirm Password:
          <input 
            type="password"
            name="password2"
            ref={(input) => {this._password2 = input; }}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    )
  }
}
