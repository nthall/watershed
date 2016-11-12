from __future__ import unicode_literals

from django.conf import settings
from django.db import models

PLATFORMS = (
    (0, 'Soundcloud'),
    (1, 'Bandcamp'),
    (2, 'Youtube')
)


class Item(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    uri = models.URLField()
    platform = models.IntegerField(choices=PLATFORMS)
    referrer = models.URLField()
    position = models.PositiveIntegerField()
    added_on = models.DateTimeField(auto_now_add=True)
    played = models.BooleanField(default=False)
    played_on = models.DateTimeField()
    fave = models.BooleanField(default=False)
    # tags = fields.ArrayField (postgres-specific, so, todo i guess?)

    class Meta:
        ordering = ('position',)

    def save(self, *args, **kwargs):
        '''
        todo: allow checkbox option to save at front of list
        '''
        queue = Item.objects.get(user=self.user)
        self.position = len(queue)

        super(Item, self).save(*args, **kwargs)
