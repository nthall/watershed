var port = chrome.runtime.connect({name: "player"});

window.addEventListener("message", function(event) {
  if (event.source != window) {
    return false;
  }

  port.postMessage(event.data);
},
false);

port.onMessage.addListener(function(data) {
  if (data.advance) {
    window.postMessage(data, "*");
  }
});
