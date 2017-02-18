import React from 'react'
import FontAwesome from 'react-fontawesome'

import style from './addForm.scss'

export default class AddForm extends React.Component {
  constructor(props) {
    super(props)

    this.send = this.send.bind(this)
  }

  send(event) {
    event.persist()
    if (event.key == "Enter") {
      const auth = this.props.user.header()
      const data = {
        'uri': event.target.value,
        'referrer': window.location.href
      }
      $.ajax({
        url: '/queue/',
        headers: {
          Authorization: auth
        },
        method: 'POST',
        dataType: 'json',
        data
      }).done( () => {
        event.target.value = ''
        $('.fa-check').toggle().delay(4000).fadeOut('slow');
        $(event.target).blur()
      })
    }
  }

  showInput() {
    $("#addBtn").toggle('slow')
    const $input = $("#addInput")
    $input.toggle('slow', () => {
      $input.focus()
    })
  }
  
  showButton() {
    $("#addBtn").toggle('slow')
    $("#addInput").toggle('slow')
  }

  render() {
    return (
      <div id="addContainer">
        <FontAwesome name='check' fixedWidth />
        <button
          id="addBtn" 
          className="btn control"
          onClick={this.showInput}
        >
          <FontAwesome name="plus" size="3x" ariaLabel="Add URL to Queue" fixedWidth />
        </button>
        <input
          id="addInput"
          onBlur={this.showButton}
          onKeyPress={this.send}
        />
      </div>
    )
  }

}
