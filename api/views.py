from __future__ import unicode_literals

import logging

from django.http import Http404
from django.contrib.auth import get_user_model

from rest_framework import permissions, status
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework_bulk.mixins import BulkUpdateModelMixin

from models import Item
from permissions import IsOwner
from serializers import ItemSerializer

User = get_user_model()

logger = logging.getLogger(__name__)


class Queue(ListCreateAPIView):
    '''
    view or add to the queue
    '''
    permission_classes = (permissions.IsAuthenticated, IsOwner,)
    serializer_class = ItemSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def post(self, request, format=None):
        data = {"user": request.user.pk}
        data['platform'] = int(request.data.get('platform'))
        post = request.data.copy()
        post.update(data)

        # have to explicitly pass context or BulkMixin screws you
        context = self.get_serializer_context()
        serializer = ItemSerializer(data=post, context=context)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ItemDetail(BulkUpdateModelMixin, ListCreateAPIView):
    '''
    view, update, or remove an Item
    '''
    permission_classes = (permissions.IsAuthenticated, IsOwner,)
    serializer_class = ItemSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Item.objects.filter(user=self.request.user.pk)

    def get_object(self, user_id, item_id):
        try:
            user = User.objects.get(pk=user_id)
            return Item.objects.filter(pk=item_id, user=user)
        except Item.DoesNotExist:
            raise Http404

    def patch(self, request, *args, **kwargs):
        return self.partial_bulk_update(request, *args, **kwargs)
