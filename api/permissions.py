from __future__ import unicode_literals

from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    message = 'No touchy!'

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
