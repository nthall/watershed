import getDomain from './getDomain'

export default function jslog () {
  chrome.storage.local.get('token', (items) => {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message)
    }

    if (items.token) {
      chrome.runtime.sendMessage({'action': 'getDomain'}, (response) => {
        const uri = response.domain + 'jslog/'
        const method = "POST"
        const authorizationHeader = "Token " + items.token
        const headers = new Headers({
          Authorization: authorizationHeader,
          "Content-Type": "application/json"
        })

        let msg = arguments.join(' ')

        let req = new Request(uri, {method, msg})
        fetch(req)
      })
    }
  })
}
