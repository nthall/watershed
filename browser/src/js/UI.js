export default class UI {
  static message(payload) {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0]['id'], payload)
    })
  }

  setup() {
    let container = document.getElementById("ws-container")
    if (!container) {
      let container = document.createElement("div")
      container.id = "ws-container"

      let header = document.createElement("h2")
      header.textContent = "Watershed"
      container.append(header)

      let message = document.createElement("div")
      message.id = "ws-message"
      container.append(message) 
      let content = document.createElement("div")
      content.id = "ws-content"
      container.append(content)
      document.body.appendChild(container)
    }
    return this
  }

  remove() {
    let container = document.getElementById("ws-container")
    container.parentNode.removeChild(container)
    if (this.fading) {
      window.clearInterval(this.fading)
    }
  }

  fadeOut() {
    const container = document.getElementById("ws-container")
    container.style.opacity = 1

    const duration = 5000
    const interval = 10
    const step = interval / duration

    const fader = () => {
      if (container.style.opacity > 0) {
        container.style.opacity -= step
      } else {
        this.remove()
      }
    }

    this.fading = window.setInterval(fader, interval)
  }

  error(msg) {
    const str = `<p class='error'>Sorry, something went wrong. ${(msg) ? msg : ''} </p>`
    document.getElementById('ws-message').innerHTML = str
    return this
  }

  showLogin() {
    let authForm = document.createElement('form')
    authForm.method = "POST"
    authForm.id = "ws-authForm"
    authForm.innerHTML = `
      <input type="email" name="username" placeholder="email" />
      <input type="password" name="password" placeholder="password" />
      <button type="submit">Login</button>
    `

    authForm.addEventListener('submit', (event) => {
      event.preventDefault()
      const body = new FormData(event.target)
      let req = new Request("https://watershed.nthall.com/authtoken/", {
        method: "POST",
        body 
      })

      fetch(req)
        .then( (response) => { return response.json() } )
        .then( (json) => {
          if (json.token) {
            json.username = body.get('username')
            chrome.storage.local.set(json)
            const str = "<p>Login success! Saving...</p>"
            document.getElementById('ws-content').innerHTML = str
            chrome.runtime.sendMessage({'action': 'save'})
            return true
          } else {
            console.log("login fail")
          }
        }
      )
    })

    document.getElementById("ws-content").appendChild(authForm)

    return this
  }

  saveProgress() {
    document.getElementById('ws-content').innerHTML = "<p>Saving...</p>"
    return this
  }

  saveSuccess() {
    //  '🎤', '🎧', '🎼', '🎹', '🎷', '🎺', '🎸', '🎻', '💃🏿', '👏', '⚡️', '💿', '🎙'
    const emojis = ['\uD83C\uDFA4',
                    '\uD83C\uDFA7',
                    '\uD83C\uDFBC',
                    '\uD83C\uDFB9',
                    '\uD83C\uDFB7',
                    '\uD83C\uDFBA',
                    '\uD83C\uDFB8',
                    '\uD83C\uDFBB',
                    '\uD83D\uDC83\uD83C\uDFFF',
                    '\uD83D\uDC4F',
                    '\u26A1\uFE0F',
                    '\uD83D\uDCBF',
                    '\uD83C\uDF99'
                   ]
    const emoji1 = emojis[Math.floor(Math.random() * emojis.length)]
    const emoji2 = emojis[Math.floor(Math.random() * emojis.length)]
    const str = `<p>${emoji1}   Saved! ${emoji2}</p>`
    document.getElementById('ws-content').innerHTML = str
    return this
  }

}
