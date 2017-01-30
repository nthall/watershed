import React from 'react'
import LoginForm from '../LoginForm/LoginForm'
import RegisterForm from '../RegisterForm/RegisterForm'

import style from './loginorregister.scss'

export default class LoginOrRegister extends React.Component {
  constructor(props) {
    super(props)
    this.state = {register: false}

    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState( (prevState, props) => {
      return {register: !prevState.register}
    })
  }

  render() {
    return (
      <div>
        <h1>Watershed Music Player</h1>
        <div className="toggle">
          <span>
            <a 
              id="login" 
              className={this.state.register ? "dormant" : "active"}
              onClick={this.toggle}
            >
              Login
            </a>
            &nbsp;|&nbsp;
            <a 
              id="register" 
              className={this.state.register ? "active" : "dormant"}
              onClick={this.toggle}
            >
              Register
            </a>
          </span>
        </div>
        {this.state.register ? 
          <RegisterForm submit={this.props.submit} /> 
          :
          <LoginForm submit={this.props.submit} />
        }
      </div>
    )
  }
}
