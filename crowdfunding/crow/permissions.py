from django.http import HttpResponseRedirect
from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.reverse import reverse
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from .models import *


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if (request.method in permissions.SAFE_METHODS) and (obj.confirmed == True):
            return True

        return obj.user == request.user

class AllowDestroyClosureRequest(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if (obj.admin is None):
            return True
        return False



class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, ProjectChangeRequest):
            return obj.user == request.user
        if isinstance(obj, Project):
            return obj.user == request.user
        if isinstance(obj, User):
            return obj == request.user
        if isinstance(obj, ProfileChangeRequest):
            return obj.user == request.user
        if isinstance(obj, ProjectClosureRequest):
            return obj.project.user == request.user
        return False

class IsProjectConfirmed(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Project):
            if obj.confirmed is True:
                return True
            return False

class IsProjectInWorkOrInNotConfirmed(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if obj.status_code == ProjectStatusCode.objects.get(code="1") or obj.status_code == ProjectStatusCode.objects.get(code="0"):
            return True
        return False

class IsProjectInWork(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if obj.status_code == ProjectStatusCode.objects.get(code="1"):
            return True
        return False

class IsTransferAllowed(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if obj.transfer_allowed is True:
            return True
        return False

class IsCashOutAllowed(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if obj.status_code == ProjectStatusCode.objects.get(code="3") and obj.transfer_allowed is True:
            return True
        return False

class IsAuthenticatedAndConfirmed(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user.is_authenticated and request.user.confirmed)


class IsUserProfile(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.pk == request.user.pk


def get_project_change_request_view_permissions(view):
    permission_classes = [IsAdminUser]
    if view.action == 'list':
        permission_classes = [IsAdminUser]
    if view.action == 'retrieve':
        permission_classes = [IsAdminUser | IsOwner]
    if view.action == 'update':
        permission_classes = [IsAdminUser]
    if view.action == 'destroy':
        permission_classes = [IsAdminUser | IsOwner]
    if view.action == 'see_admin_response':
        permission_classes = [IsOwner]
    if view.action == 'show_request':
        permission_classes = [IsAuthenticatedAndConfirmed]
    return [permission() for permission in permission_classes]


def get_project_view_permissions(view):
    permission_classes = [AllowAny]
    if view.action == 'list':
        permission_classes = [AllowAny]
    if view.action == 'retrieve':
        permission_classes = [IsAdminUser | IsOwner | IsProjectConfirmed]
    if view.action == 'create':
        permission_classes = [IsAuthenticatedAndConfirmed]
    if view.action == 'change_request':
        permission_classes = [IsOwner & IsProjectInWorkOrInNotConfirmed]
    if view.action == 'confirm_project':
        permission_classes = [IsAdminUser]
    if view.action == 'payment':
        permission_classes = [IsAuthenticatedAndConfirmed & IsProjectInWork]
    if view.action == 'see_confirm_status':
        permission_classes = [IsOwner]
    if view.action == 'not_confirmed_projects':
        permission_classes = [IsAdminUser]
    if view.action == 'remove_image':
        permission_classes = [IsAdminUser | IsOwner]
    if view.action == 'close_money_collection':
        permission_classes = [IsOwner & IsTransferAllowed & IsProjectInWork]
    if view.action == 'answer':
        permission_classes = [IsAdminUser]
    if view.action == 'cash_out':
        permission_classes = [IsOwner & IsCashOutAllowed]
    if view.action == 'add_post':
        permission_classes = [IsOwner & IsProjectConfirmed]
    if view.action == 'get_post':
        permission_classes = [IsProjectConfirmed]
    return [permission() for permission in permission_classes]


def get_profile_view_permissions(view):
    permission_classes = [AllowAny]
    if view.action == 'list':
        permission_classes = [IsAdminUser]
    if view.action == 'retrieve':
        permission_classes = [AllowAny]
    if view.action == 'create':
        permission_classes = [AllowAny]
    if view.action == 'partial_update':
        permission_classes = [IsOwner]
    if view.action == 'get_message_reset_password':
        permission_classes = [IsOwner]
    if view.action == 'get_email_verification_message':
        permission_classes = [IsOwner]
    if view.action == 'change':
        permission_classes = [IsOwner]
    if view.action == 'not_confirmed_users':
        permission_classes = [IsAdminUser]
    if view.action == 'confirm_user':
        permission_classes = [IsAdminUser]
    if view.action == 'see_confirm_status':
        permission_classes = [IsOwner]
    if view.action == 'show_requests':
        permission_classes = [IsOwner | IsAdminUser]
    if view.action == 'replenishment':
        permission_classes = [IsAuthenticatedAndConfirmed]
    if view.action == 'payout':
        permission_classes = [IsAuthenticatedAndConfirmed]
    return [permission() for permission in permission_classes]


def get_profile_change_request_view_permissions(view):
    permission_classes = [AllowAny]
    if view.action == 'list':
        permission_classes = [IsAdminUser]
    if view.action == 'retrieve':
        permission_classes = [IsAdminUser | IsOwner]
    if view.action == 'destroy':
        permission_classes = [IsOwner]
    if view.action == 'answer':
        permission_classes = [IsAdminUser]
    if view.action == 'see_admin_response':
        permission_classes = [IsOwner]
    return [permission() for permission in permission_classes]

def get_closure_request_view_permissions(view):
    permission_classes = [AllowAny]
    if view.action == 'list':
        permission_classes = [IsAdminUser]
    if view.action == 'retrieve':
        permission_classes = [IsAdminUser | IsOwner]
    if view.action == 'destroy':
        permission_classes = [IsOwner & AllowDestroyClosureRequest]
    if view.action == 'see_request':
        permission_classes = [IsAuthenticated]
    if view.action == 'answer':
        permission_classes = [IsAdminUser]
    return [permission() for permission in permission_classes]