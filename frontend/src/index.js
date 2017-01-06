import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App/App'
import setup from './common'

setup()

ReactDOM.render(<App />,
document.getElementById('container'))
