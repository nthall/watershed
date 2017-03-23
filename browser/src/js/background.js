import UI from './UI'

const onSave = function(data, textStatus, jqXHR) {
  UI.message({'action': 'saved'})
}

const onErr = function(jqXHR, textStatus, errorThrown) {
  console.log(errorThrown, textStatus, jqXHR)
  if (jqXHR.status === 401) {
    // some kind of error message would be good
    UI.message({'action': 'force_login', 'msg': jqXHR.responseText})
  }
}

const save = function() {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
    send({
      uri: tabs[0].url,
      referrer: tabs[0].url
    })
  })
  return true
}

const send = function(data) {
  chrome.storage.local.get('token', (items) => {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message)
    }

    if (items.token) {
      const url = "https://watershed.nthall.com/queue/"
      const method = "POST"
      const authorizationHeader = "Token " + items.token
      const headers = new Headers({
        Authorization: authorizationHeader,
        "Content-Type": "application/json"
      })
      let req = new Request(url, {
        method,
        body: JSON.stringify(data),
        headers
      })

      fetch(req).then(onSave, onErr)

      // TODO: after moving to pocket-style feedback window,
      // use it to display a feedback message in onSave/onErr
    } else {
      UI.message({'action': 'force_login'})
    }
  })
}


chrome.browserAction.onClicked.addListener( (tab) => {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError)
  }
  return save()
})

chrome.runtime.onMessage.addListener(function(data) {
  if (chrome.runtime.lastError) { 
    console.log(chrome.runtime.lastError)
  }
  if (data.action) {
    if (data.action == 'save') {
      UI.message({'action': 'saving'})
      return save()
    }
  }
})


chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "player")

  port.onMessage.addListener(function(data, origin) {
    if (data.type == "BANDCAMP_LOAD") {
      chrome.tabs.executeScript(origin.sender.tab.id,
      {
        file: "js/bandcamp.js",
        allFrames: true
      })
    } else if (data.advance) {
      if (typeof(data.repeat) === 'undefined') {
        data.repeat = true
        port.postMessage(data)
      }
    }
  })

})

chrome.contextMenus.create({
  contexts: ['all'],
  type: 'normal',
  id: 'context-save',
  title: 'Save to Watershed'
})

chrome.contextMenus.onClicked.addListener( (info, tab) => { 
  UI.message({'action': 'saving'})
  send({
    uri: info.linkUrl,
    referrer: info.pageUrl || ''
  })
})
