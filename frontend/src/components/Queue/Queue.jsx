import React from 'react'
import FontAwesome from 'react-fontawesome'
import Item from '../Item/Item'
import User from '../../classes/User'
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
    this.state = {items: []}
    this.updateServer = false  // set true to send update to server
    this.refreshInterval = 5000
    
    this.loadItemsFromServer = this.loadItemsFromServer.bind(this)
    this.advanceList = this.advanceList.bind(this)
    this.moveItem = this.moveItem.bind(this)

    this.refreshData = this.refreshData.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
  }

  loadItemsFromServer() {
    //todo: only add new items??? idfk
    const auth = this.props.user.header()
    const deferred = $.ajax({
      url: '/item/',
      headers: {
        Authorization: auth
      },
      cache: false,
      dataType: 'json',
      method: 'GET'
    })

    deferred.done(function(data) {
      if (this.updateServer) {
      } else {
        this.setState({items: data})
      }
    }.bind(this))

    return deferred
  } 

  refreshData() {
    // send updated positions, etc. to server and *then* loadItemsFromServer again
    // (rather than just use the response data to update state -- just to make sure
    //  we get the full list)
    // this is maybe slightly premature but TOO DANG BAD

    // NB: only send what we need to send to avoid overwriting new info on server

    let payload = this.state.items.map((item) => {
      const whitelist = ['id', 'position']
      let output = {}

      for (let i=0, l=whitelist.length; i < l; i++) {
        output[whitelist[i]] = item[whitelist[i]]
      }

      return output
    })

    const auth = this.props.user.header()
    const deferred = $.ajax({
      headers: {
        Authorization: auth
      },
      url: '/item/',
      method: 'PATCH',
      cache: false,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(payload),
      processData: false,
    })

    deferred.done(function() { this.updateServer = false; this.loadItemsFromServer() }.bind(this))

    return deferred
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
        items: prevState.items.map((item) => {
          if (item === target) {
            item.position = newpos
          } else if (oldpos > newpos) {
            if ((item.position >= newpos) && (item.position < oldpos)) {
              item.position =  item.position + 1
            }
          } else {
            if ((item.position <= newpos) && (item.position > oldpos)) {
              item.position =  item.position - 1
            }
          }
          return item
        })
      }
    })
  }

  componentDidMount() {
    this.loadItemsFromServer()
    
    // make sure there's a 0th position item. if not, advance the list!
    let check = $.grep(this.state.items, (item) => { return item.position == 0 })
    if (check.length == 0) {
      jslog("we got either a new or a bad queue state. advancing list.", "Queue", "componentDidMount");
      this.advanceList()
    }
    
    setInterval(this.loadItemsFromServer, this.refreshInterval)
  }

  componentDidUpdate() {
    if (this.updateServer) {
      this.refreshData()
    }
  }

  advanceList() {
    this.updateServer = true
    this.setState((prevState, props) => {
      return {
        items: prevState.items.map((item) => {
          item.position = item.position - 1
          return item
        })
      }
    })
  }

  render() {
    let Items = this.state.items.filter( (item) => { return item.position > 0 } ).map( (item) => {
      return <Item data={item} key={item.id} deleteItem={this.deleteItem} moveItem={this.moveItem} />
    }).sort(function(a,b) { return a.props.data.position - b.props.data.position })

    let currentItem = this.state.items.filter((item) => { return item.position == 0 })[0]
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
        </div>
        {Player || ''}
        <div id="listContainer">
          <ul>
            {Items}
          </ul>
        </div>
      </div>
    )
  }
}
