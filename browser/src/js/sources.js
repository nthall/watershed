const urlCheck = function(srcName) {
  return (document.location.href.indexOf(srcName) > -1)
}

// from http://stackoverflow.com/a/7090123/354176
const searchParams = function() {
  const pairs = window.location.search.substring(1).split("&")
  let obj = {}
  let pair
  let i

  for ( i in pairs ) {
    if ( pairs[i] === "" ) continue

    pair = pairs[i].split("=")
    obj[ decodeURIComponent( pair[0] ) ] = decodeURIComponent( pair[1] )
  }

  return obj
}

const bandcamp = function() {
  let go = false
  if (urlCheck('bandcamp')) {
    go = true
  }
  let check2 = document.querySelector("meta[property='twitter:site']")
  if (check2 && (check2.content == "bandcamp")) {
    go = true
  }

  if (go) {
    // todo: better scrubbing/solution for artist & title
    // for an example of it failing, try it on music.disasterpeace.com/album/fez-ost
    const title = document.querySelector("h2.trackTitle[itemprop='name']")
      .innerHTML.trim()
    const artist = document.querySelector("span[itemprop='byArtist'] > a")
      .innerHTML.trim()
    const embed = document.querySelector("meta[property='og:video:secure_url']").content
    const data = {
      artist,
      title,
      embed
    }
    return data
  } else {
    return false
  }
}

const soundcloud = function() {
  if (urlCheck('soundcloud')) {
    const title = document.querySelector(".soundTitle__title > span").innerHTML.trim()
    const artist = document.querySelector(".soundTitle__username").innerHTML.trim()
    // embed html comes from hitting their /oembed endpoint server-side
    const embed = ''

    const data = {
      title,
      artist,
      embed
    }
    return data
  } else {
    return false
  }
}

const youtube = function() {
  if (urlCheck('youtube')) {
    const title = document.querySelector("meta[itemprop='name']").content.trim()
    const embed = searchParams()['v'] || ''
    const data = {
      title,
      embed
    }
    return data
  } else {
    return false
  }
}

const sources = ['',
 bandcamp,
 youtube, 
 soundcloud
]

for (var i=1;i<sources.length;i++) {
  let data = sources[i]() 
  if (data !== false) {
    data['platform'] = i
    data['uri'] = window.location.href
    data['action'] = 'save'
    chrome.runtime.sendMessage(data)
    break
  }
}
