import React from 'react'
import SoundCloud from 'react-soundcloud-widget'
import Youtube from 'react-youtube'
import style from './player.scss'

class Player extends React.Component {
  constructor(props) {
    super(props)

    this.updateServer = this.updateServer.bind(this)
  }

  updateServer(data) {
    const url = `/item/{$this.props.data.id}/`
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
    window.playbackEnd = this.props.playbackEnd
    window.addEventListener('message', function(event) {
      if (event.data.advance) {
        window.playbackEnd()
      }
    })
  }

  load() {
    window.postMessage({type: "BANDCAMP_LOAD"}, "*")
  }


  render() {
    return (
      <div className="bandcampContainer playerContainer">
        <iframe 
          id="bandcampPlayer" 
          name="bandcampPlayer"
          src={this.props.item.embed}
          onLoad={this.load} 
        />
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
      <div className="youtubeContainer playerContainer">
        <Youtube
          videoId={this.props.item.embed}
          onEnd={this.props.playbackEnd}
          opts={this.opts}
        />
      </div>
    )
  }
}

class SoundcloudPlayer extends Player {
  constructor(props) {
    super(props)
    this.opts = {
      visual: true,
			auto_play: true
    }

    this.widget = null
    this.lastSoundIndex = null
    this.currentSoundIndex = 0
    this.getWidgetInterval = null

    this.playbackEnd = this.playbackEnd.bind(this)
    this.getWidget = this.getWidget.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
  }

  playbackEnd() {
    if (this.lastSoundIndex === 0) {
      this.props.playbackEnd()
    } else {
      this.widget.getCurrentSoundIndex( (response) => {
        if (response === this.lastSoundIndex) {
          this.props.playbackEnd()
        } else {
          this.currentSoundIndex = response
        }
      })
    }
  }

  getWidget() {
    try {
      this.widget = window.SC.Widget('react-sc-widget')
      this.widget.getSounds( (response) => {
        this.lastSoundIndex = response.length - 1
      })
    } catch (e) { console.log('dang widget', e) }

    if ((this.widget !== null) && (this.lastSoundIndex !== null)) {
      clearInterval(this.getWidgetInterval)
    }
  }

  componentDidMount() {
    this.getWidgetInterval = setInterval(this.getWidget, 10000)
  }

  render() {
    return (
      <div className="soundCloudContainer playerContainer">
        <SoundCloud
          url={this.props.item.uri}
          onEnd={this.playbackEnd}
          opts={this.opts}
        />
      </div>
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
