import Cookies from 'js-cookie'

export default class Server {
  constructor(data) {
    this.CSRFToken = Cookies.get('csrftoken')

    this.defaultOptions = {
      headers: {
        'X-CSRFToken': this.CSRFToken
      },
    }
  }
  
  csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }

  dispatch(endpoint, data={}, success, err=this.defaultErr) {
    
  }
  
  defaultErr() {}

  get(endpoint, success, err=this.defaultErr) {
    this.dispatch(endpoint, success)
  }

  post(endpoint, data, success, err=this.defaultErr) {
    let options = this.defaultOptions
    options.body = JSON.stringify(data)
  }

  delete(endpoint, data, success, err=this.defaulterr) {
    let options = this.defaultOptions
    options.method = 'DELETE'
    options.body = JSON.stringify(data)

    fetch(endpoint, options).then(callback)
  }

  log(str, component='', func='', err=false) {
    let data = {str, component, func, err}
    this.post('/jslog/', data)
  }
}
