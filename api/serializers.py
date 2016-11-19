from __future__ import unicode_literals

from django.contrib.auth import get_user_model
from rest_framework import serializers

from models import Item

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    queue = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Item.objects.filter(played=False)
    )

    class Meta:
        model = User
        fields = ('id', 'queue')


class ItemSerializer(serializers.ModelSerializer):
    '''
    todo: validation -- only supported platforms
            (this should probably be frontend's job, but, just to be sure)
    '''
    class Meta:
        model = Item
        fields = ('user', 'uri', 'artist', 'title', 'platform', 'referrer')
