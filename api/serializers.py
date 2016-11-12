from __future__ import unicode_literals

from rest_framework import serializers

from models import Item


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('uri', 'platform', 'referrer')
