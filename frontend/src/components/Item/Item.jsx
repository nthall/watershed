import React from 'react'

import style from './item.scss'

export default class Item extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sep: (this.props.data.artist) ? " - " : "",
      iconClass: `platform${this.props.data.platform}`
    }
  }

  render() {
    return (
      <li className="queueItem">
        <span aria-hidden="true" className={this.state.iconClass} />
				<span className="info">
					{this.props.data.artist}{this.state.sep}{this.props.data.title}
				</span>
      </li>
    )
  }
}
