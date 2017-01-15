var onSave = function(data, textStatus, jqXHR) {
  browser.runtime.sendMessage({'action': 'saved'});
};

var onErr = function(jqXHR, textStatus, errorThrown) {
  console.log(errorThrown, textStatus, jqXHR); 
  if (jqXHR.status === 401) {
    // some kind of error message would be good
    browser.storage.local.clear();
  }
};

var save = function(data) {
  browser.runtime.sendMessage({'action': 'get_token'}, function(response) {
    if (browser.runtime.lastError) {
      console.log(browser.runtime.lastError.message);
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

browser.runtime.onMessage.addListener(function(data) {
  if (browser.runtime.lastError) { 
    console.log(browser.runtime.lastError);
  }
  if (data.action) {
    if (data.action == 'save') {
      delete data.action;
      save(data);
      return true; // async
    }
  }
});


browser.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "player");

  port.onMessage.addListener(function(data, origin) {
    if (data.type == "BANDCAMP_LOAD") {
      browser.tabs.executeScript(origin.sender.tab.id,
      {
        file: "/js/bandcamp.js",
        allFrames: true
      });
    } else {
      if (data.advance) {
        port.postMessage(data);
      }
    }
  });

});
