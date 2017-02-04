window.onload = function () {
  chrome.storage.local.get('token', function (items) {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message)
    }

    if (!items.token) {
      document.getElementById('authForm').style.display = 'block'
    } else {
      chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError.message)
        }

        if (data.action == "get_token") {
          sendResponse({'token': items.token})
        }
      })

      document.getElementById('content').innerHTML = "<h2>Saving...</h2>"
      chrome.tabs.executeScript({file: "js/sources.js"})
      return true
    }
  })
  document.getElementById('authForm').addEventListener('submit', function(event) {
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
          document.getElementById('content').innerHTML = "<p>Login success! Click the extension again to save this page.</p>"
        } else {
          console.log("login fail")
        }
      }
    )
  })
  chrome.runtime.onMessage.addListener(function(data) {
    if (chrome.runtime.lastError) { 
      console.log(chrome.runtime.lastError)
    }
    if (data.action == 'saved') {
      //  '🎤', '🎧', '🎼', '🎹', '🎷', '🎺', '🎸', '🎻', '💃🏿', '👏', '⚡️', '💿', '🎙'
      const emojis = ['\uD83C\uDFA4', '\uD83C\uDFA7', '\uD83C\uDFBC', '\uD83C\uDFB9', '\uD83C\uDFB7', '\uD83C\uDFBA', '\uD83C\uDFB8', '\uD83C\uDFBB', '\uD83D\uDC83\uD83C\uDFFF', '\uD83D\uDC4F', '\u26A1\uFE0F', '\uD83D\uDCBF', '\uD83C\uDF99']
      const emoji1 = emojis[Math.floor(Math.random() * emojis.length)]
      const emoji2 = emojis[Math.floor(Math.random() * emojis.length)]
      document.getElementById('content').innerHTML = `<p>${emoji1}   Saved! ${emoji2}</p>`
    }
  })
}
