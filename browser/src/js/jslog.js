import getDomain from './getDomain'

export default function jslog (msg) {
  chrome.storage.local.get('token', (items) => {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message)
    }

    if (items.token) {
      getDomain().then( (domain) => {
        const uri = domain + 'jslog/'
        const method = "POST"
        const authorizationHeader = "Token " + items.token
        const headers = new Headers({
          Authorization: authorizationHeader,
          "Content-Type": "application/json"
        })

        let req = new Request(uri, {method, msg})
        fetch(req)
      })
    }
  })
}
