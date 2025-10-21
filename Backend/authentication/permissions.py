from rest_framework.permissions import BasePermission

class IsStaffOrSuperUser(BasePermission):
    """
    Only authenticated staff or superusers can access.
    """
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            (request.user.is_staff or request.user.is_superuser)
        )