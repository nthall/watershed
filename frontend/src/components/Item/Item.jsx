const React = require('react')

export default class Item extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sep: (this.props.data.artist) ? " - " : ""
    }
  }

  render() {
    return (
      <li key={this.props.key}>{this.props.data.artist}{this.state.sep}{this.props.data.title}</li>
    )
  }
}
