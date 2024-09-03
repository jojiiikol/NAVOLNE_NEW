from django.http import HttpResponseRedirect
from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.reverse import reverse

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if (request.method in permissions.SAFE_METHODS) and (obj.confirmed == True):
            return True

        return obj.user == request.user


class IsAuthenticatedAndConfirmed(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.confirmed)

class IsUserProfile(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.pk == request.user.pk
