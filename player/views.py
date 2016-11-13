from __future__ import unicode_literals

from django.http import Http404
from django.contrib.auth import get_user_model

from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from api.models import Item
from api.serializers import ItemSerializer

User = get_user_model()


class Queue(APIView):
    '''
    view or add to the queue
    '''
    permission_classes = permissions.isAuthenticated

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get(self, request, user_id, format=None):
        user = User.objects.get(pk=user_id)
        items = Item.objects.filter(user=user, played=False)
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request, user_id, format=None):
        serializer = ItemSerializer(request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ItemDetail(APIView):
    '''
    view, update, or remove an Item

    todo: authentication lol
    '''
    permission_classes = permissions.isAuthenticated

    def get_object(self, user_id, item_id):
        try:
            user = User.objects.get(pk=user_id)
            return Item.objects.filter(pk=item_id, user=user)
        except Item.DoesNotExist:
            raise Http404

    def get(self, request, user_id, item_id, format=None):
        item = self.get_object(user_id, item_id)
        serializer = ItemSerializer(item)
        return Response(serializer.data)

    def put(self, request, user_id, item_id, format=None):
        item = self.get_object(user_id, item_id)
        serializer = ItemSerializer(item, request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id, item_id, format=None):
        item = self.get_object(user_id, item_id)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
