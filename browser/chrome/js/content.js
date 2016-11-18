chrome.runtime.onMessage.addListener(function(data) {
  $('body').append(JSON.stringify(data));
  if (chrome.runtime.lastError) { 
    console.log(chrome.runtime.lastError);
    // jslog(chrome.runtime.lastError);
  }
});

chrome.tabs.executeScript({file: "js/sources.js", allFrames: true});
