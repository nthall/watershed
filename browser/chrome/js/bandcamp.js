play = document.getElementById("big_play_button");

if (play) {  // only run logic in bandcamp iframe
  tracklist = document.getElementById("tracklist_ul");

  if (tracklist) {
    loaded_track = document.getElementById("currenttitle_tracknum");
    if (loaded_track.text != "1.") {

    }
  }

  play.click(); // autoplay
 
  player = document.getElementById("player");
  audio = document.getElementsByTagName('audio');
}
