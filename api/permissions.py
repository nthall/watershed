from __future__ import unicode_literals

from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    message = 'No touchy!'

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsSelf(permissions.BasePermission):
    message = 'Nah, not cool'

    def has_object_permission(self, request, view, obj):
        return obj == request.user
