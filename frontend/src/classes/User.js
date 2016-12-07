export default class User {
  constructor(data) {
    this.data = data
  }

  header() {
    return (
      "Authorization: Token " + this.data.token
    )
  }
}
