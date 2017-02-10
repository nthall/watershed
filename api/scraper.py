from __future__ import unicode_literals

import logging

import requests
from bs4 import BeautifulSoup

from models import PLATFORMS

logger = logging.getLogger(__name__)


class UnsupportedPlatformError(Exception):
    '''
    Supported platform not found :(
    '''
    pass


class ParseError(Exception):
    '''
    something went wrong while parsing, dang
    '''


class Scraper():
    '''
    pass a URI and receive either:
    - False (if no supported platform found) or
    - a dict containing the scraped data
      - dict keys:
        - platform
        - embed
        - title
        - artist (optional)
    '''
    def __init__(self, uri):
        self.uri = uri
        self.page = requests.get(uri)
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
        '''
        for i, v in PLATFORMS[1:]:  # index 0 is "Unknown"
            if v.lower() in self.uri:
                return i

        twitter = self.soup.find('meta', property="twitter:site")
        if dict(twitter.attrs)['content'] is not "bandcamp":
            raise UnsupportedPlatformError

    def bandcamp(self):
        artist = self.soup.select("span[itemprop='byArtist'] > a")[0]
        self.artist = artist.getText().strip()

        title = self.soup.select("h2.trackTitle[itemprop='name']")[0]
        self.title = title.getText().strip()

        meta = self.soup.find("meta", property='og:video:secure_url')
        embed = dict(meta.attrs)['content']
        self.embed = embed.replace("tracklist=false", "tracklist=true")

        return

    def soundcloud(self):
        logger.debug(self.soup.title)
        parts = [i.strip() for i in self.soup.title.getText().split("|")]
        self.artist = parts[1]
        remove = " by {}".format(self.artist)
        self.title = parts[0].replace(remove, '')

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
        self.title = self.soup.find(attrs={'name': 'description'})['content']

        query = self.url.split("?")[-1]
        self.embed = query.split("=")[-1]
        return

    def result(self):
        return {
            'artist': self.artist,
            'embed': self.embed,
            'title': self.title,
            'platform': self.platform
        }
