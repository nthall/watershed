import React from 'react'

class Player extends React.Component {
  updateServer(data) {
    const url = `https://playq.io/item/{$this.props.data.id}/`
    $.ajax({
      url,
      data,
      method: "PUT",
      header: this.props.user.header(),
      contentType: 'json',
      error: function(response) {
        setTimeout(2000, this.updateServer(data))
      },
      success: function(response) {
        // TBD
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
  componentDidMount() {
    super()
  }

  render() {
    return (
      <div>
        {this.props.data.embed}
      </div>
    )
  }
}

class YoutubePlayer extends Player {
  componentDidMount() {
    super()
  }

  render() {
    return (
      <div>
        <div className='youtubeContainer'></div>
      </div>
    )
  }
}

class SoundcloudPlayer extends Player {
  componentDidMount() {
    super()
  }

  render() {
    return (
      <div>
        {this.props.data.embed}
      </div>
    )
  }
}

export { BandcampPlayer, YoutubePlayer, SoundcloudPlayer }
