const onSave = function(data, textStatus, jqXHR) {
  chrome.runtime.sendMessage({'action': 'saved'})
}

const onErr = function(jqXHR, textStatus, errorThrown) {
  console.log(errorThrown, textStatus, jqXHR)
  if (jqXHR.status === 401) {
    // some kind of error message would be good
    chrome.storage.local.clear()
  }
}

const save = function(data) {
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
      // TODO: after moving to pocket-style feedback window, 
      // use it to force login here
    }
  })
}

chrome.runtime.onMessage.addListener(function(data) {
  if (chrome.runtime.lastError) { 
    console.log(chrome.runtime.lastError)
  }
  if (data.action) {
    if (data.action == 'save') {
      delete data.action
      save(data)
      return true; // async
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
    } else {
      if (data.advance) {
        port.postMessage(data)
      }
    }
  })

})

chrome.contextMenus.create({
  contexts: ['all'],
  type: 'normal',
  id: 'context-save',
  title: 'Save to Watershed',
  onclick: (info) => { 
    save({
      uri: info.linkUrl,
      referrer: info.pageUrl
    })
  }
})
