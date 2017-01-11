export default class User {
  constructor(data) {
    this.data = data
  }

  header() {
    return (
      "Token " + this.data.token
    )
  }
}
