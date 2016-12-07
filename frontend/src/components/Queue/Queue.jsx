import React from 'react'
import Item from '../Item/Item'
import User from '../../classes/User'

export default class Queue extends React.Component {
  constructor(props) {
    super(props)
    this.state = {data: []}
    this.loadItemsFromServer = this.loadItemsFromServer.bind(this)
  }

  loadItemsFromServer() {
    $.ajax({
      context: this,
      url: '/queue/',
      header: this.props.user.header(),
      cache: false,
      dataType: 'json',
      contentType: 'json',
      method: 'GET',
      success: function(data) {
        console.log(data)
        this.setState({data: data})
      }.bind(this)
    })
  } 

  componentDidMount() {
    this.loadItemsFromServer()
    setInterval(this.loadItemsFromServer, 1000)
  }

  render() {
    var Items = this.state.data.map(function(item) {
      return <Item data={item} key={item.id} />
    });

    return (
      <ul>
        {Items}
      </ul>
    )
  }
}
