from __future__ import unicode_literals

from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from rest_framework.authtoken.models import Token

import requests

PLATFORMS = (
    (0, 'Unknown'),
    (1, 'Bandcamp'),
    (2, 'Youtube'),
    (3, 'Soundcloud'),
)


class Item(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='items',
                             on_delete=models.CASCADE)
    uri = models.URLField()
    platform = models.IntegerField(choices=PLATFORMS)
    artist = models.CharField(max_length=255, blank=True)
    title = models.CharField(max_length=255, blank=True)
    embed = models.TextField(blank=True)
    referrer = models.URLField(blank=True)
    position = models.IntegerField(default=1)
    added_on = models.DateTimeField(auto_now_add=True)
    played_on = models.DateTimeField(null=True)
    fave = models.BooleanField(default=False)
    # tags = fields.ArrayField (postgres-specific, so, todo i guess?)

    class Meta:
        ordering = ('position',)

    def save(self, *args, **kwargs):
        '''
        todo: allow checkbox option to save at front of list?
        '''
        queue = Item.objects.filter(user=self.user)
        self.position = len(queue)

        if (self.platform == 3):
            # get soundcloud embed
            data = {
                'iframe': True,
                'format': 'json',
                'auto_play': False,
                'url': self.uri
            }
            r = requests.get('https://soundcloud.com/oembed', data)
            response = r.json()
            self.embed = response['html']

        super(Item, self).save(*args, **kwargs)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
