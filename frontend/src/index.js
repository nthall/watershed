import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App/App'
import {setup, jslog} from './common'
import * as Sentry from '@sentry/browser'

Sentry.init({ dsn: 'https://69327d4caef74ac694a6a76e93c96524@sentry.io/274934' })

setup()

window.onerror = function (msg, url, line, col, error) {
  jslog(`${error.name} - ${msg}`, '', '', true)
}

ReactDOM.render(<App />,
document.getElementById('container'))
