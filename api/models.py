from __future__ import unicode_literals

from django.conf import settings
from django.db import models
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

from rest_framework.authtoken.models import Token

PLATFORMS = (
    (0, 'Unknown'),
    (1, 'Bandcamp'),
    (2, 'Youtube'),
    (3, 'Soundcloud'),
)


class ItemManager(models.Manager):
    def queue(self, user):
        return self.filter(user=user, position__gte=0)

    def history(self, user):
        return self.filter(user=user, position__lt=0)


class Item(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='items',
                             on_delete=models.CASCADE)
    uri = models.URLField()
    platform = models.IntegerField(choices=PLATFORMS)
    artist = models.CharField(max_length=255, blank=True)
    title = models.CharField(max_length=255, blank=True)
    embed = models.TextField(blank=True)
    referrer = models.URLField(blank=True)
    position = models.IntegerField(null=True)
    added_on = models.DateTimeField(auto_now_add=True)
    played_on = models.DateTimeField(null=True, default=None)
    fave = models.BooleanField(default=False)
    # tags = fields.ArrayField (postgres-specific, so, todo i guess?)

    objects = ItemManager()

    def __unicode__(self):
        return " - ".join([self.user.__unicode__(), self.artist, self.title])

    class Meta:
        ordering = ('position',)

    def save(self, *args, **kwargs):
        '''
        todo: allow checkbox option to save at front of list?
        '''

        if self.position is None:
            self.position = Item.objects.queue(self.user).count()

        super(Item, self).save(*args, **kwargs)

    def move(self, new_position):
        '''
        move an item to a new pos and adjust the rest of the queue around it

        NB: ignore history for now, it'll break shit
        '''
        queue = Item.objects.queue(self.user)
        queue = list(queue)
        queue.remove(self)
        queue.insert(new_position, self)

        for i, item in enumerate(queue):
            item.position = i
            item.save()

    def move_to_front(self):
        ''' move an item to position 1 '''
        self.move(1)

    def move_to_back(self):
        ''' move an item to the end of the queue '''
        self.move(Item.objects.queue(self.user).count())


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    ''' create auth token on user create '''
    if created:
        Token.objects.create(user=instance)


@receiver(pre_delete, sender=Item)
def squash_list(sender, instance=None, **kwargs):
    '''  when deleting, reorder queue to avoid holes that trip up react '''
    items = Item.objects.filter(position__gt=instance.position,
                                user=instance.user
                                )
    for i in items:
        i.position = i.position - 1
        i.save()
