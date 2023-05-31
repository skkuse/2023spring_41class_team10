from django.contrib import admin
from .models import User


class UserAdmin(admin.ModelAdmin):
  search_fields = ["id", "username", "github_username", "email"]
  list_display = ("id", "username", "github_username", "email", "created_at", "last_login", "profile_image_url")

  @admin.display(description='lecture', ordering='lecture__title')
  def get_lecture(self, obj):
    return obj.lecture.title 
  @admin.display(description='field', ordering='field__field')
  def get_field(self, obj):
    return obj.field.field 

admin.site.register(User, UserAdmin)

