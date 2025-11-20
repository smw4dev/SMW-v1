# Backend/authentication/admin.py
# # authentication/admin.py
# from django.contrib import admin
# from django.contrib.admin import AdminSite
# from django.utils.translation import gettext_lazy as _
# from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
# from .models import User
# from .forms import UserCreationForm, UserChangeForm


# class SuperuserOnlyAdminSite(AdminSite):
#     site_header = _("Superuser Admin")
#     site_title = _("Superuser Admin Portal")
#     index_title = _("Welcome Superuser")

#     def has_permission(self, request):
#         return request.user.is_active and request.user.is_superuser



# class CustomUserAdmin(BaseUserAdmin):
#     add_form = UserCreationForm
#     form = UserChangeForm
#     model = User

#     list_display = ['id', 'email', 'f_name', 'l_name','is_staff', 'is_superuser']
#     list_filter = ['is_staff', 'is_superuser', 'is_approved']

#     fieldsets = (
#         (None, {'fields': ('email', 'password')}),
#         ('Personal info', {'fields': ('f_name', 'l_name', 'phone', 'photo')}),
#         ('Permissions', {'fields': ('is_staff', 'is_approved', 'is_superuser', 'is_active', 'groups', 'user_permissions')}),
#     )

#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('email', 'f_name', 'l_name', 'is_staff', 'is_approved', 'is_superuser', 'photo', 'password1', 'password2'),
#         }),
#     )

#     search_fields = ['email', 'f_name', 'l_name']
#     ordering = ['email']

# admin.site.register(User, CustomUserAdmin)


