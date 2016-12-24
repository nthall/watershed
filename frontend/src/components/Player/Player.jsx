import React from 'react'
import SoundCloud from 'react-soundcloud-widget'
import Youtube from 'react-youtube'

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
      method: "PATCH",
      header: this.props.user.header(),
      contentType: 'application/json',
      processData: false,
      error: function(response) {
        setTimeout(this.updateServer(data), 2000)
      }.bind(this),
      success: function(response) {
        // TBD, maybe noop
        return
      }
    }).bind(this)
  }

  render() {
  }
}

class BandcampPlayer extends Player {
  constructor(props) {
    super(props)

    // extension interactions
    window.onPlaybackEnd = this.props.playbackEnd
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="bandcampContainer">
        <iframe id="bandcampPlayer" src={this.props.item.embed} />
      </div>
    )
  }
}

class YoutubePlayer extends Player {
  constructor(props) {
    super(props)
    this.opts = {
      playerVars: {
        autoplay: 1
      }
    }
  }

  render() {
    return (
      <Youtube
        videoId={this.props.item.embed}
        onEnd={this.props.playbackEnd}
        opts={this.opts}
      />
    )
  }
}

class SoundcloudPlayer extends Player {
  constructor(props) {
    super(props)
    this.opts = {
      visual: true,
    }

  }

  render() {
    return (
      <SoundCloud
        url={this.props.item.uri}
        onEnd={this.props.playbackEnd}
        opts={this.opts}
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
