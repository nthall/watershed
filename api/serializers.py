import logging

from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_bulk import BulkListSerializer, BulkSerializerMixin

from .models import Item

User = get_user_model()

logger = logging.getLogger(__name__)


class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "position",
        )


class ItemSerializer(BulkSerializerMixin, serializers.ModelSerializer):
    """
    todo: extra validation -- only supported platforms
            (this should probably be frontend's job, but, just to be sure)
    """

    class Meta:
        model = Item
        fields = (
            "id",
            "user",
            "position",
            "uri",
            "artist",
            "embed",
            "title",
            "platform",
            "referrer",
            "played_on",
        )
        list_serializer_class = BulkListSerializer
