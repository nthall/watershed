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

  port.onMessage.addListener(function(data, origin) {
    if (data.type == "BANDCAMP_LOAD") {
      chrome.tabs.executeScript(origin.sender.tab.id,
      {
        file: "js/bandcamp.js",
        allFrames: true
      });
    } else {
      // all that's left is to figure out how to get the message from the
      // bandcamp frame to the player frame successfully! argh!!
      if (data.advance) {
        port.postMessage(data);
      }
    }
  });

});
