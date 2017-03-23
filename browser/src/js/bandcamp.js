const play = document.getElementById("big_play_button")

const advance = function() {
  window.parent.postMessage({
    advance: true,
    sender: 'bandcamp',
    repeat: false
  }, "*")
}


if (play) {  // only run logic in bandcamp iframe
  const tracklist = document.getElementById("tracklist_ul").children
  let active_tracks = []
  
  const l = tracklist.length;
  for (let i=0; i < l; i++) {
    if (!tracklist[i].classList.contains("nostream")) {
      active_tracks.push(tracklist[i])
    }
  }

  // maybe just check length > 1? might make this all simpler.
  if (active_tracks) {
    let loaded_track = document.getElementById("currenttitle_tracknum")
    const first_tracknum = active_tracks[0].children[0].textContent
    if (loaded_track.textContent !== first_tracknum) {
      active_tracks[0].click()
    } else {
      play.click()
    }

    const last_track = active_tracks[active_tracks.length - 1]
    if (last_track.children[0].textContent == loaded_track.textContent) {
      document.getElementsByTagName('audio')[0].addEventListener('ended', () => {
        advance()
      })
    } else {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.target.classList.contains("currenttrack")) {
            document.getElementsByTagName('audio')[0].addEventListener('ended', () => {
              advance()
              observer.disconnect()
            })
          }
        })
      })

      observer.observe(last_track, {attributes: true, attributeFilter: ["class"]})
    }
  } else {
    // todo: active_tracks approach may mean that if we end up in this else block we just need to advance the list??
    play.click() // autoplay
    document.getElementsByTagName('audio')[0].addEventListener('ended', () => {
      advance()
    })
  }
}
