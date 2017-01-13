import React from 'react'
import FontAwesome from 'react-fontawesome'

import PlatformMap from '../../classes/PlatformMap'
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
    const platform = PlatformMap[this.props.data.platform]
    return (
      <li className="queueItem">
        <FontAwesome 
          name={platform}
          fixedWidth
        />
				<span className="info">
					{this.props.data.artist}{this.state.sep}{this.props.data.title}
				</span>
      </li>
    )
  }
}
