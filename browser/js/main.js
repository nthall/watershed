window.onload = function () {
  chrome.storage.local.get('token', function (items) {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message);
    }

    if (!items.token) {
      $("#authForm").css('display', 'block');
    } else {
      chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError.message);
        }

        if (data.action == "get_token") {
          sendResponse({'token': items.token});
        }
      });

      $('#content').html("<h2>Saving...</h2>");
      chrome.tabs.executeScript({file: "js/sources.js"});
      return true;
    }
  });
  $('#authForm').on('submit', function(event) {
    event.preventDefault();
    $.post("http://watershed.nthall.com/authtoken/",
      $(this).serialize(),
      function (response) {
        if (response.token) {
          chrome.storage.local.set(response);
          $("#content").html("<p>Login success!</p>");
        } else {
          console.log("login fail");
        }
      },
      'json'
    );
  });
  chrome.runtime.onMessage.addListener(function(data) {
    if (chrome.runtime.lastError) { 
      console.log(chrome.runtime.lastError);
    }
    if (data.action == 'saved') {
      //  '🎤', '🎧', '🎼', '🎹', '🎷', '🎺', '🎸', '🎻', '💃🏿', '👏', '⚡️', '💿', '🎙'
      emojis = ['\uD83C\uDFA4', '\uD83C\uDFA7', '\uD83C\uDFBC', '\uD83C\uDFB9', '\uD83C\uDFB7', '\uD83C\uDFBA', '\uD83C\uDFB8', '\uD83C\uDFBB', '\uD83D\uDC83\uD83C\uDFFF', '\uD83D\uDC4F', '\u26A1\uFE0F', '\uD83D\uDCBF', '\uD83C\uDF99']; 
      emoji1 = emojis[Math.floor(Math.random() * emojis.length)];
      emoji2 = emojis[Math.floor(Math.random() * emojis.length)];
      $('#content').text(emoji1 + "   Saved! " + emoji2)
    }
  });
};