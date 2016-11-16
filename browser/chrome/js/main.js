chrome.browserAction.onClicked.addListener(function( tabs.Tab tab) {
  $(document).append("<p>" + tab.url + "</p>");
}
