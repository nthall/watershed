chrome.tabs.query({"currentWindow": true, "active": true}, function(tabs) {
  $("body").append($("<p>" + tabs[0].url + "</p>"));
});
