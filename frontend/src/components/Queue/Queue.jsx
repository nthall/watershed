import React from 'react'
import FontAwesome from 'react-fontawesome'

import AddForm from '../AddForm/AddForm'
import Item from '../Item/Item'
import { 
  BandcampPlayer, 
  YoutubePlayer,
  SoundcloudPlayer,
  getPlayer
} from '../Player/Player'

import { jslog } from '../../common'

import style from './queue.scss'

export default class Queue extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      history: false,
      position: 0
    }
    this.updateServer = false  // set true to send update to server
    this.refreshing = false
    this.refreshInterval = 5000

    this.loadItemsFromServer = this.loadItemsFromServer.bind(this)
    this.advanceList = this.advanceList.bind(this)
    this.moveItem = this.moveItem.bind(this)
    this.toggleDisplay = this.toggleDisplay.bind(this)

    this.refreshData = this.refreshData.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
  }

  loadItemsFromServer(get_position=false) {
    const auth = this.props.user.header()
    const deferred_list = $.ajax({
      url: '/item/',
      headers: {
        Authorization: auth
      },
      cache: false,
      dataType: 'json',
      method: 'GET'
    })

    const deferred_position = $.ajax({
      url: '/position/',
      headers: {
        Authorization: auth
      },
      cache: false,
      dataType: 'json',
      method: 'Get'
    })

    let deferred = $.when(deferred_list, deferred_position)
      .done(function(items_result, position_result) {
        let items = items_result[0]
        let position = position_result[0].position || 0
        if (!(this.updateServer)) {
          // this is an attempt to further safeguard against the 502 flail, idk
          this.setState( (prevState, props) => {
            if ((items.length == 0))  {
              // tbh i have no idea if this branch makes sense or is useful.
              return prevState
            } else {
              if (get_position) {
                return {items, position}
              } else {
                return {items}
              }
            }
          })
        }
      }.bind(this)
    )

    return deferred
  } 

  refreshData() {
    // send updated positions, etc. to server and *then* loadItemsFromServer again
    // (rather than just use the response data to update state -- just to make sure
    //  we get the full list)
    // NB: only send what we need to send to avoid overwriting new info on server

    if (!this.refreshing) {
      this.refreshing = true

      let payload = {position: this.state.position}
      
      const auth = this.props.user.header()
      const deferred = $.ajax({
        headers: {
          Authorization: auth
        },
        url: '/position/',
        method: 'PATCH',
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        processData: false,
      })

      deferred.done(function() { this.updateServer = false; this.refreshing = false; this.loadItemsFromServer() }.bind(this))

      return deferred
    }
  }

  deleteItem(item) {
    this.updateServer = true
    const auth = this.props.user.header()
    const deferred = $.ajax({
      headers: {
        Authorization: auth
      },
      url: '/item/',
      method: 'DELETE',
      cache: false,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({id: item.id}),
      processData: false
    })
    const del = item

    this.setState( (prevState, props) => {
      return {
        items: prevState.items.filter( (item) => {
          return (item !== del)
        })
      }
    })
  }

  moveItem(target, newpos) {
    this.updateServer = true
    const oldpos = target.position
    this.setState( (prevState, props) => { 
      return {
        items: prevState.items.splice(newpos, 0, prevState.items.splice(prevState.items.indexOf(target)))
      }
    })
  }

  componentDidMount() {
    this.loadItemsFromServer(true).then( () => {
      setInterval(this.loadItemsFromServer, this.refreshInterval)
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.updateServer && !this.refreshing) {
      this.refreshData()
    }
  }

  advanceList() {
    this.updateServer = true
    this.setState((prevState, props) => {
      return {
        position: prevState.position + 1
      }
    })
  }

  toggleDisplay() {
    this.setState( (prevState, props) => {
      return {history: !prevState.history}
    })
  }

  render() {
    const Playlist = []
    const History = []

    const all = this.state.items.map( (item) => {
        return <Item data={item} key={item.id} deleteItem={this.deleteItem} moveItem={this.moveItem} />
      }).sort(function(a,b) { return a.props.data.position - b.props.data.position })

    all.forEach( (item) => {
      if (item.props.data.position < this.state.position) {
        History.push(item)
      } else if (item.props.data.position > this.state.position) {
        Playlist.push(item)
      }
    })

    const currentItem = this.state.items.filter((item) => { return item.position == this.state.position })[0]
    let Player = false
    if (typeof currentItem !== 'undefined') {
      Player = getPlayer({
        item: currentItem, 
        playbackEnd: this.advanceList,
        user: this.props.user
      })
    }

    return (
      <div id="queueContainer">
        <div id="controls">
          <button className="btn control" id="skipBtn" onClick={this.advanceList}>
            <FontAwesome name="fast-forward" size="3x" ariaLabel="Play Next Item" fixedWidth />
          </button>
          <br />
          <AddForm user={this.props.user} />
        </div>
        {Player || ''}
        <div className="toggle">
          <span>
            <a
              id="playlist"
              className={this.state.history ? "dormant" : "active"}
              onClick={this.toggleDisplay}
            >
              Playlist
            </a>
            &nbsp;|&nbsp;
            <a
              id="history"
              className={this.state.history ? "active" : "dormant"}
              onClick={this.toggleDisplay}
            >
              History
            </a>
          </span>
        </div>
        <div id="listContainer">
          {this.state.history ? 
            <ul id="historyContainer">
              {History}
            </ul>
            :
            <ul id="playlistContainer">
              {Playlist}
            </ul>
          }
        </div>
      </div>
    )
  }
}
