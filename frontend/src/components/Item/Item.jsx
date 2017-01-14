import React from 'react'
import FontAwesome from 'react-fontawesome'

import PlatformMap from '../../classes/PlatformMap'
import style from './item.scss'

export default class Item extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sep: (this.props.data.artist) ? " - " : "",
      iconClass: `platform${this.props.data.platform}`,
      hide: false
    }

    this.delete = this.delete.bind(this)
  }

  delete() {
    this.props.deleteItem(this.props.data)
    this.setState({hide: true}) // just manage display here, let server handle reality
  }

  render() {
    const platform = PlatformMap[this.props.data.platform].toLowerCase()

    let style = {}
    if (this.state.hide) {
      style.display = 'none'
    }

    return (
      <li className="queueItem" style={style}>
        <FontAwesome name={platform} className="icon" fixedWidth />
				<span className="info">
					{this.props.data.artist}{this.state.sep}{this.props.data.title}
				</span>
        <FontAwesome name="trash" size="lg" className="icon pull-right" onClick={this.delete} fixedWidth />
      </li>
    )
  }
}
