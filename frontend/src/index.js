import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App/App'
import {setup, jslog} from './common'

setup()

window.onerror = function (msg, url, line, col, error) {
  jslog(`${error.name} - ${msg}`, '', '', true)
}

ReactDOM.render(<App />,
document.getElementById('container'))
