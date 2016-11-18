var sources = ['',
 bandcamp,
 youtube, 
 soundcloud
]

for (var i=1;i<sources.length;i++) {
  data = sources[i](); 
  if (data !== false) {
    data['source'] = i;
    chrome.runtime.sendMessage(data);
  }
}

var urlCheck = function(srcName) {
  return (document.location.href.indexOf(srcName) > -1);
}

var bandcamp = function() {
  go = false
  if (urlCheck('bandcamp')) {
    go = true;
  }
  check2 = document.querySelector("meta[property='twitter:site']")
  if (check2 && (check2.content == "bandcamp")) {
    go = true;
  }

  if (go) {
    // todo: better scrubbing/solution for artist & title
    // for an example of it failing, try it on music.disasterpeace.com/album/fez-ost
    var title = document.querySelector("meta[property='og:title']").content;
    var artist = document.querySelector("meta[property='og:site_name']").content;
    data = {
      artist: artist,
      title: title
    };
    return data;
  } else {
    return false;
  }
}

var soundcloud = function() {
  if (urlCheck('soundcloud')) {
    var title = document.querySelector(".soundTitle__title > span").innerHTML.trim();
    var artist = document.querySelector(".soundTitle__username").innerHTML.trim();
    data = {
      artist: artist,
      title: title
    };
    return data;
  } else {
    return false;
  }
}

var youtube = function() {
  if (urlCheck('youtube')) {
    var title = document.querySelector("meta[itemprop='name']").content;
    data = {
      title: title
    };
    return data;
  } else {
    return false;
  }
}
