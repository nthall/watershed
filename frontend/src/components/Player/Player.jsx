import React from 'react'
import SoundCloud from 'react-soundcloud-widget'

class Player extends React.Component {
  constructor(props) {
    super(props)

    this.updateServer = this.updateServer.bind(this)
  }

  updateServer(data) {
    const url = `https://playq.io/item/{$this.props.data.id}/`
    $.ajax({
      url,
      data,
      context: this,
      method: "PUT",
      header: this.props.user.header(),
      contentType: 'application/json',
      processData: false,
      error: function(response) {
        setTimeout(this.updateServer(data), 2000)
      }.bind(this),
      success: function(response) {
        // TBD
        return
      }
    }).bind(this)
  }

  componentDidMount() {
    this.updateServer({
      'played_on': Date.now(),
      'position': 0,
    })
  }

  render() {
  }
}

class BandcampPlayer extends Player {

  render() {
    return (
      <div>
        {this.props.data.embed}
      </div>
    )
  }
}

class YoutubePlayer extends Player {
  render() {
    return (
      <div>
        <div className='youtubeContainer'></div>
      </div>
    )
  }
}

class SoundcloudPlayer extends Player {
  constructor(props) {
    super(props)
    this.opts = {
      visual: true,
    }

    this.componentDidMount = this.componentDidMount.bind(this)
  }

  render() {
    return (
      <SoundCloud
        url={this.props.item.uri}
        opts={this.opts}
        onEnd={this.props.playbackEnd}
      />
    )
  }
}

function getPlayer(props) {
  const players = {
    1: <BandcampPlayer {...props} />,
    2: <YoutubePlayer {...props} />,
    3: <SoundcloudPlayer {...props} />
  }

  return players[props.item.platform]
}


export { BandcampPlayer, YoutubePlayer, SoundcloudPlayer, getPlayer }
