function run() {
  document.getElementById('content').innerHTML = "<h2>Saving...</h2>"
  chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
    chrome.runtime.sendMessage({action: 'save', uri: tabs[0].url})
  })

  chrome.runtime.onMessage.addListener( (data) => {
    if (chrome.runtime.lastError) { 
      console.log(chrome.runtime.lastError)
    }
    if (data.action == 'saved') {
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
      document.getElementById('content').innerHTML = str
    }
  })

  return true
}

window.onload = function () {
  chrome.storage.local.get('token', (items) => {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message)
    }

    if (items.token) {
      return run()
    } else {
      authForm = document.getElementById('authForm')
      authForm.style.display = 'block'
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
              chrome.storage.local.set(json)
              const str = "<p>Login success! Saving...</p>"
              document.getElementById('content').innerHTML = str
              return run()
            } else {
              console.log("login fail")
            }
          }
        )
      })
    }
  })

}
