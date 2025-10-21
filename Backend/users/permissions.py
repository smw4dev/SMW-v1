from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrStaff(BasePermission):
    """
    Admin (your role via is_staff) or Superuser can write.
    Everyone authenticated can read their own profile endpoints.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        u = request.user
        return bool(u and u.is_authenticated and (u.is_staff or u.is_superuser))
