var port = chrome.runtime.connect({name: "player"});
var advance = function() {
  window.parent.postMessage({advance: true, sender: 'bandcamp'}, "*");
}

var play = document.getElementById("big_play_button");

if (play) {  // only run logic in bandcamp iframe
  var tracklist = document.getElementById("tracklist_ul");

  if (tracklist) {
    var loaded_track = document.getElementById("currenttitle_tracknum");
    if (loaded_track.text != "1.") {
      tracklist.children[0].click();
    }

    var last_track = tracklist.children[tracklist.children.length - 1];
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.target.classList.contains("currenttrack")) {
          document.getElementsByTagName('audio')[0].addEventListener('ended', advance);
        }
      })
    });

    observer.observe(last_track, {attributes: true, attributeFilter: ["class"]});
  } else {
    play.click(); // autoplay
    document.getElementsByTagName('audio')[0].addEventListener('ended', advance);
  }
}
