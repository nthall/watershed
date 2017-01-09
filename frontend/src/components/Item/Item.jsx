import React from 'react'

import style from './item.scss'

export default class Item extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sep: (this.props.data.artist) ? " - " : ""
    }
  }

  render() {
    return (
      <li className="queueItem platform{this.props.data.platform}">{this.props.data.artist}{this.state.sep}{this.props.data.title}</li>
    )
  }
}
