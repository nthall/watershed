const port = chrome.runtime.connect({name: "player"})

window.addEventListener("message", function(event) {
  if (event.source != window) {
    if (event.source == window.frames['bandcampPlayer']) {
      window.postMessage(event.data, "*")
    } else {
      return false
    }
  }

  port.postMessage(event.data)
},
false)

port.onMessage.addListener(function(data) {
  // this is really just for the advance message
  if (data.advance && !data.repeat) {
    window.postMessage(data, "*")
  }
})
