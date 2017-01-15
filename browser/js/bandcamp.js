var port = browser.runtime.connect({name: "player"});
var advance = function() {
  window.parent.postMessage({advance: true, sender: 'bandcamp'}, "*");
}

var play = document.getElementById("big_play_button");

if (play) {  // only run logic in bandcamp iframe
  var tracklist = document.getElementById("tracklist_ul").children;
  var active_tracks = [];
  
  for (i=0,l=tracklist.length; i < l; i++) {
    if (!tracklist[i].classList.contains("nostream")) {
      active_tracks.push(tracklist[i]);
    }
  }

  // maybe just check length > 1? might make this all simpler.
  if (active_tracks) {
    var loaded_track = document.getElementById("currenttitle_tracknum");
    var first_tracknum = active_tracks[0].children[0].textContent;
    if (loaded_track.textContent !== first_tracknum) {
      active_tracks[0].click();
    } else {
      play.click();
    }

    var last_track = active_tracks[active_tracks.length - 1];
    if (last_track.children[0].textContent == loaded_track.textContent) {
      document.getElementsByTagName('audio')[0].addEventListener('ended', advance);
    } else {
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.target.classList.contains("currenttrack")) {
            document.getElementsByTagName('audio')[0].addEventListener('ended', advance);
          }
        })
      });

      observer.observe(last_track, {attributes: true, attributeFilter: ["class"]});
    }
  } else {
    // todo: active_tracks approach may mean that if we end up in this else block we just need to advance the list??
    play.click(); // autoplay
    document.getElementsByTagName('audio')[0].addEventListener('ended', advance);
  }
}
