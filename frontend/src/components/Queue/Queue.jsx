import React from 'react'
import FontAwesome from 'react-fontawesome'

import AddForm from '../AddForm/AddForm'
import Item from '../Item/Item'
import { getPlayer } from '../Player/Player'

import './queue.scss'

export default class Queue extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      history: false,
      position: 0
    }
    this.updateServer = false // set true to send update to server
    this.refreshing = false
    this.refreshInterval = 5000

    this.serverCheck = this.serverCheck.bind(this)
    this.initialLoad = this.initialLoad.bind(this)
    this.advanceList = this.advanceList.bind(this)
    this.moveItem = this.moveItem.bind(this)
    this.toggleDisplay = this.toggleDisplay.bind(this)

    this.refreshData = this.refreshData.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
  }

  initialLoad() {
    const auth = this.props.user.header()
    const deferred_items = $.ajax({
      url: '/item/',
      headers: {
        authorization: auth
      },
      cache: false,
      dataType: 'json',
      method: 'get'
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

    let deferred = $.when(deferred_items, deferred_position)
      .done(function(items_result, position_result) {
        let items = items_result[0]
        let position = position_result[0].position || 0
        if (!(this.updateServer)) {
          // this is an attempt to further safeguard against the 502 flail, idk
          this.setState( (prevState, props) => {
            if ((items.length == 0)) {
              // tbh i have no idea if this branch makes sense or is useful post queue-refactor
              return prevState
            } else {
              return {items, position}
            }
          })
        }
      }.bind(this)
    )

    return deferred
  } 

  serverCheck() {
    const auth = this.props.user.header()
    const deferred_items = $.ajax({
      url: '/item/',
      headers: {
        authorization: auth
      },
      cache: false,
      dataType: 'json',
      method: 'get'
    }).done(function(result, textStatus, jqXHR) {
      if ((jqXHR.status === 200) && !(this.updateServer)) {
        this.setState( (prevState, props) => {
          return {items: result}
        })
      }
    }.bind(this))

    return deferred_items
  }

  refreshData() {
    // send updated positions, etc. to server and *then* loadItemsFromServer again
    // (rather than just use the response data to update state -- just to make sure
    //  we get the full list)
    // NB: only send what we need to send to avoid overwriting new info on server
    // TODO: this needs work lol  (1/20)

    if (!this.refreshing) {
      this.refreshing = true

      let position_payload = {position: this.state.position}


      let items_payload = this.state.items.map((item) => {
        const whitelist = ['id', 'position']
        let output = {}

        for (let i=0, l=whitelist.length; i < l; i++) {
          output[whitelist[i]] = item[whitelist[i]]
        }

        return output
      })
      
      const auth = this.props.user.header()
      const deferred_position = $.ajax({
        headers: {
          Authorization: auth
        },
        url: '/position/',
        method: 'PATCH',
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(position_payload),
        processData: false,
      })

      const deferred_items = $.ajax({
        headers: {
          Authorization: auth
        },
        url: '/item/',
        method: 'PATCH',
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(items_payload),
        processData: false,
      })

      let deferred = $.when(deferred_items, deferred_position)
        .done(function() { 
          this.updateServer = false
          this.refreshing = false
          this.serverCheck() 
        }.bind(this))

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
      let position = prevState.position
      if (del.position < position) {
        position = position - 1
      }

      let items = prevState.items.filter( (item) => {
        return (item !== del)
      })
      items.map( (item, index) => {
        item.position = index
      })

      return { items, position }
    })
  }

  moveItem(target, item_destination) {
    const item_origin = target.position
    let queue_position = this.state.position
    if (typeof item_destination === "string") {
      if (item_origin < queue_position) {
        queue_position = queue_position - 1
      }
      if (item_destination === "now") {
        item_destination = queue_position
      } else if (item_destination === "next") {
        item_destination = queue_position + 1
      }
    }
    this.updateServer = true

    this.setState( (prevState, props) => { 
      let position = queue_position
      let items = prevState.items
      items.splice(item_destination, 0, items.splice(item_origin, 1)[0])
      items.map( (item, index) => {
        item.position = index
      })
      return { items, position }
    })
  }

  componentDidMount() {
    this.initialLoad().then( () => {
      setInterval(this.serverCheck, this.refreshInterval)
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
      }).sort(function(a, b) { return a.props.data.position - b.props.data.position })

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
