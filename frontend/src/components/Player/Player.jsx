import React from 'react'
import SoundCloud from 'react-soundcloud-widget'
import Youtube from 'react-youtube'
import style from './player.scss'

class Player extends React.Component {
  constructor(props) {
    super(props)
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

    this.widget = null
    this.lastSoundIndex = null
    this.currentSoundIndex = 0
    this.advance = false

    this.playbackStart = this.playbackStart.bind(this)
    this.playbackEnd = this.playbackEnd.bind(this)
    this.loadWidget = this.loadWidget.bind(this)
    
    this.opts = {
      visual: true,
			auto_play: true,
      liking: true,
      callback: this.loadWidget
    }

  }

  playbackStart() {
    this.widget.getCurrentSoundIndex( (response) => {
      this.currentSoundIndex = response
      if (response === this.lastSoundIndex) {
        this.advance = true
      } else {
        this.advance = false
      }
    })
  }

  playbackEnd() {
    if ((this.lastSoundIndex === 0) || (this.advance === true)) {
      this.props.playbackEnd()
    }
  }

  loadWidget() {
    try {
      this.widget = window.SC.Widget('react-sc-widget')
      this.widget.getSounds( (response) => {
        this.lastSoundIndex = response.length - 1
      })
    } catch (e) { console.log('dang widget', e) }

  }

  render() {
    return (
      <div className="soundCloudContainer playerContainer">
        <SoundCloud
          url={this.props.item.uri}
          onPlay={this.playbackStart}
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
