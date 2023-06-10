from django.contrib import admin
from .models import User, UserGitHubRepository


class UserAdmin(admin.ModelAdmin):
  search_fields = ["id", "username", "github_username", "email"]
  list_display = ("id", "username", "github_username", "email", "created_at", "last_login", "profile_image_url")

  @admin.display(description='lecture', ordering='lecture__title')
  def get_lecture(self, obj):
    return obj.lecture.title 
  @admin.display(description='field', ordering='field__field')
  def get_field(self, obj):
    return obj.field.field 

class UserGitHubRepositoryAdmin(admin.ModelAdmin):
  search_fields = ["id", "github_username", "repo_name"]
  list_display = ("id", "github_username", "repo_name", "lang", "get_short_desc", "topics", "get_short_memo", "update_at")

  @admin.display(description='description')
  def get_short_desc(self, obj):
    if len(obj.description) > 30:
      return obj.description[:30] + "..."
    else :
      return obj.description
  @admin.display(description='memo')
  def get_short_memo(self, obj):
    if len(obj.memo) > 60:
      return obj.memo[:60] + "..."
    else :
      return obj.memo

admin.site.register(User, UserAdmin)
admin.site.register(UserGitHubRepository, UserGitHubRepositoryAdmin)
