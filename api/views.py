from __future__ import unicode_literals

import json
import logging

from django.http import HttpResponse, Http404, HttpResponseForbidden
from django.contrib.auth import get_user_model
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework import permissions, status
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework_bulk.mixins import BulkUpdateModelMixin
from rest_framework.authtoken.models import Token

from models import Item
from permissions import IsOwner
from serializers import ItemSerializer

User = get_user_model()

logger = logging.getLogger(__name__)
jslogger = logging.getLogger('js')


class Queue(ListCreateAPIView):
    '''
    view or add to the queue
    '''
    permission_classes = (permissions.IsAuthenticated, IsOwner,)
    serializer_class = ItemSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @method_decorator(csrf_exempt)
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

    def delete(self, request, *args, **kwargs):
        try:
            # todo: this needs to be cleaned up several ways lol
            user = User.objects.get(pk=request.user.id)
        except:
            return HttpResponseForbidden()

        try:
            item_id = request.data.get("id")
            item = Item.objects.get(pk=item_id, user=user)
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Item.DoesNotExist:
            raise Http404


class JsLog(View):
    def post(self, request):
        component = request.POST.get('component')
        func = request.POST.get('func')
        err = request.POST.get('err')
        auth = request.POST.get('auth')

        if auth:
            auth = json.loads(auth)
            token = Token.objects.get(key=auth['token'])
            u_str = token.user.email + ": "
        else:
            u_str = ""

        if component and func:
            loc = "{}:{} - ".format(component, func)
        else:
            loc = ""

        msg = u_str + loc + request.POST.get('str')

        if (err == 'true'):
            jslogger.error(msg)
        else:
            jslogger.debug(msg)

        return HttpResponse()
