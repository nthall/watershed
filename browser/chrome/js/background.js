var onSave = function(data, textStatus, jqXHR) {
  chrome.runtime.sendMessage({'action': 'saved'});
};

var onErr = function(jqXHR, textStatus, errorThrown) {
  console.log(errorThrown, textStatus, jqXHR); 
};

var save = function(data) {
  chrome.runtime.sendMessage({'action': 'get_token'}, function(response) {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message);
    }

    var url = "http://watershed.nthall.com/queue/";
    var method = "POST";
    var authorizationHeader = "Token " + response.token;
    // todo: probably use statusCode object to define actions for failure modes
    $.ajax({
      'url': url,
      'data': JSON.stringify(data),
      'method': method,
      'headers': {
        "Authorization": authorizationHeader
      },
      'contentType': 'application/json',
      'dataType': 'json',
      'success': onSave,
      'error': onErr
    });
  });
}

chrome.runtime.onMessage.addListener(function(data) {
  if (chrome.runtime.lastError) { 
    console.log(chrome.runtime.lastError);
  }
  if (data.action) {
    if (data.action == 'save') {
      delete data.action;
      save(data);
      return true; // async
    }
  }
});


chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "player");

  var watcher = {
    advance: false,
    playing: false,
    check: function() {
      if ((this.advance == true) && (this.playing == false)) {
        port.postMessage({advance: true});
        clearInterval(this.watching);
      }
    },
    watching: null
  };

  watcher.watching = setInterval(watcher.check, 3000);

  if (chrome.runtime.lastError) { 
    console.log(chrome.runtime.lastError);
  }
  port.onMessage.addListener(function(data, port) {
    if (data.type) {
      switch (data.type) {
        case "MANUAL_PAUSE":
          watcher.advance = false;
          break;

        case "MANUAL_PLAY":
          watcher.advance = true;
          break;

        case "BANDCAMP_LOAD":
          // initialize
          chrome.tabs.executeScript(port.sender.tab.id,
          {
            file: "js/bandcamp.js",
            allFrames: true
          });


          chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
            if (changeInfo.audible) {
              watcher.playing = changeInfo.audible;
            }
          });
          break;

        default:
          return false;
      }
    }
  });

});
