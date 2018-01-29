import React from 'react'
import FontAwesome from 'react-fontawesome'

import PlatformMap from '../../classes/PlatformMap'
import style from './item.scss'

class ItemControls extends React.Component {
  constructor(props) {
    super(props)
    this.playNow = this.playNow.bind(this)
    this.playNext = this.playNext.bind(this)
    this.moveUp = this.moveUp.bind(this)
  }

  playNow() {
    this.props.move("now")
  }

  playNext() {
    this.props.move("next")
  }

  moveUp() {
    this.props.move(this.props.position - 1)
  }

  render() {
    return (
      <div className="itemControls">
        <button onClick={this.playNow} title="Play Now" className="playNow">
          <FontAwesome name="play" size="lg" className="icon" fixedWidth />
        </button>
        <button onClick={this.playNext} title="Play Next" className="playNext">
          <FontAwesome name="step-forward" rotate={270} size="lg" className="icon" fixedWidth />
        </button>
        <button onClick={this.moveUp} title="Move Up" className="moveUp">
          <FontAwesome name="caret-up" size="lg" className="icon" fixedWidth />
        </button>
        <button title="Delete" onClick={this.props.delete} className="delete">
          <FontAwesome name="trash" size="lg" className="icon" fixedWidth />
        </button>
      </div>
    )
  }

}

class Item extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sep: (this.props.data.artist) ? " - " : "",
      iconClass: `platform${this.props.data.platform}`,
      hide: false
    }

    this.delete = this.delete.bind(this)
    this.move = this.move.bind(this)
  }

  delete() {
    this.props.deleteItem(this.props.data)
    this.setState({hide: true}) // just manage display here, let server handle reality
  }

  move(newpos) {
    this.props.moveItem(this.props.data, newpos)
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

        <ItemControls move={this.move} delete={this.delete} position={this.props.data.position} />
      </li>
    )
  }

}

ItemControls.propTypes = {
  move: React.PropTypes.func.isRequired,
  delete: React.PropTypes.func.isRequired,
  position: React.PropTypes.number.isRequired
}

Item.propTypes = {
  deleteItem: React.PropTypes.func.isRequired,
  moveItem: React.PropTypes.func.isRequired,
  data: React.PropTypes.shape({
    id: React.PropTypes.number.isRequired,
    platform: React.PropTypes.number.isRequired,
    user: React.PropTypes.number.isRequired,
    title: React.PropTypes.string,
    artist: React.PropTypes.string,
    embed: React.PropTypes.string,
    uri: React.PropTypes.string
  })
}

export default Item
