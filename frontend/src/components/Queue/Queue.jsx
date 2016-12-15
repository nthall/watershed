import React from 'react'
import Item from '../Item/Item'
import User from '../../classes/User'
import { 
  BandcampPlayer, 
  YoutubePlayer,
  SoundcloudPlayer,
  getPlayer
} from '../Player/Player'

export default class Queue extends React.Component {
  constructor(props) {
    super(props)
    this.state = {items: []}
    this.loadItemsFromServer = this.loadItemsFromServer.bind(this)
    this.refreshData = this.refreshData.bind(this)
  }

  loadItemsFromServer() {
    $.ajax({
      context: this,
      url: '/item/',
      header: this.props.user.header(),
      cache: false,
      dataType: 'json',
      method: 'GET',
      success: function(data) {
        this.setState({items: data})
      }.bind(this)
    })
  } 

  refreshData() {
    // send updated positions, etc. to server and *then* loadItemsFromServer again
    // (rather than just use the response data to update state -- just to make sure
    //  we get the full list)
    // this is maybe slightly premature but TOO DANG BAD
    $.ajax({
      context: this,
      header: this.props.user.header(),
      url: '/item/',
      method: 'PATCH',
      cache: false,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(this.state.items),
      processData: false,
      success: this.loadItemsFromServer,
      error: function() { console.log('aw hell', this.state.items) }.bind(this)
    })
  }

  componentDidMount() {
    this.loadItemsFromServer()
    //setInterval(this.refreshData, 5000)
    
    // make sure there's a 0th position item. if not, advance the list!
    let check = $.grep(this.state.items, (item) => { return item.position == 0 })
    if (check.length == 0) {
      this.advanceList()
    }

  }

  advanceList() {
    this.setState((prevState, props) => {
      return {
        items: prevState.items.map((item) => {
          return item.position = item.position - 1
        })
      }
    })
  }

  playbackEnd() {
    this.advanceList()
  }

  render() {
    let Items = this.state.items.map((item) => {
      if (item.position > 0) {
        return <Item data={item} key={item.id} />
      }
    })

    // todo
    // i think right now the queryset excludes history.
    let History = this.state.items.map((item) => {
      if (item.position < 0) {
        return <Item data={item} key={item.id} />
      }
    })

    let currentItem = this.state.items.filter((item) => { return item.position == 0 })[0]
    let Player = false
    if (typeof currentItem !== 'undefined') {
      Player = getPlayer({item: currentItem, playbackEnd: this.playbackEnd})
    }

    return (
      <div id="queueContainer">
        {Player || ''}
        <ul>
          {Items}
        </ul>
      </div>
    )
  }
}
