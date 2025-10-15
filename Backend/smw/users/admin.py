from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("id","user","student_uid","current_class","group_name","school","current_batch","created_at")
    search_fields = ("user__email","student_uid","current_class","group_name")
    list_filter = ("school","current_batch")
