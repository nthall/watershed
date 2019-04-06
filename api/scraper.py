from __future__ import unicode_literals

import logging
import urlparse

import requests
from bs4 import BeautifulSoup
from rest_framework.exceptions import UnsupportedMediaType

from models import PLATFORMS

logger = logging.getLogger(__name__)


class UnsupportedPlatformError(UnsupportedMediaType):
    '''
    Supported platform not found :(
    '''
    pass


class Scraper():
    '''
    pass a URI and receive either:
    - an Error (no platform found or something)
    - a dict containing the scraped data
      - dict keys:
        - platform
        - embed
        - title
        - artist (optional)
    '''
    def __init__(self, uri):
        self.page = requests.get(uri)
        self.uri = self.page.url  # this accounts for redirects
        if self.page.status_code == 200:
            self.soup = BeautifulSoup(self.page.text, 'html5lib')
        else:
            self.page.raise_for_status()

        self.platform = self.detect_platform()
        # below line runs the data gathering by platform
        getattr(self, PLATFORMS[self.platform][1].lower())()

    def detect_platform(self):
        '''
        first check if platform name in urlstring.
        if not, assume bandcamp, try to verify.
        this is going to become untenable as platforms get added, and
        will need a fancier solution eventually
        - possibly refactor all this into classes for
        each platform that we can loop through to run the check,
        and if matched, return the data or smth
        '''
        for i, v in PLATFORMS[1:]:  # index 0 is "Unknown"
            if v.lower() in self.uri:
                return i

        # check for YT shortlinks
        if "youtu.be" in self.uri:
            return 2

        twitter = self.soup.find('meta', property="twitter:site")
        if twitter and twitter.attrs['content'] in ("bandcamp", "@bandcamp"):
            return 1
        else:
            logger.error('no platform found for uri: {}'.format(self.uri))
            raise UnsupportedPlatformError("No supported platform found :(")

    def bandcamp(self):
        artist = self.soup.select("span[itemprop='byArtist'] > a")[0]
        self.artist = artist.getText().strip()

        title = self.soup.find("h2",
                               {'class': 'trackTitle', 'itemprop': 'name'})
        self.title = title.getText().strip()

        meta = self.soup.find("meta", property='og:video:secure_url')
        embed = dict(meta.attrs)['content']
        self.embed = embed.replace("tracklist=false", "tracklist=true")

        return

    def soundcloud(self):
        logger.debug(self.soup.title)
        # example raw titles:
        # Magic Tape 69 by The Magician | Free Listening on SoundCloud
        # currently kinda sucks for artist pages and some other cases.
        parts = [i.strip() for i in self.soup.title.getText().split("|")]
        raw = parts[0].split(" by ")
        self.artist = raw[1].strip(" -")
        self.title = raw[0].replace(self.artist, '').strip(" -")

        data = {
            'iframe': True,
            'format': 'json',
            'auto_play': False,
            'url': self.uri
        }
        r = requests.get('https://soundcloud.com/oembed', data)
        response = r.json()
        self.embed = response['html']
        return

    def youtube(self):
        self.artist = ''
        self.title = self.soup.find('title').getText()\
            .replace(" - YouTube", "")

        query = urlparse.urlparse(self.uri)
        qs = urlparse.parse_qs(query[4])
        if 'v' in qs.keys():
            self.embed = qs['v'][0]
            logger.debug("youtube - v = {}".format(self.embed))
        elif 'playlist' in self.uri and 'list' in qs.keys():
            # this is not enough to make lists work right; see trello for info
            self.embed = qs['list'][0]
        return

    def result(self):
        return {
            'artist': self.artist,
            'embed': self.embed,
            'title': self.title,
            'platform': self.platform
        }
