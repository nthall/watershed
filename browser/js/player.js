var port = browser.runtime.connect({name: "player"});

window.addEventListener("message", function(event) {
  if (event.source != window) {
    if (event.source == window.frames['bandcampPlayer']) {
      window.postMessage(event.data, "*");
    } else {
      return false;
    }
  }

  port.postMessage(event.data);
},
false);

port.onMessage.addListener(function(data) {
  if (data.advance) {
    window.postMessage(data, "*");
  }
});
