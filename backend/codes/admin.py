from django.contrib import admin
from .models import Refactor, Review, Deadcode, Comment, Commit

class RefactorAdmin(admin.ModelAdmin):
  search_fields = ["id"]
  list_display = ("id", "get_short_code", "get_short_message", "target")
  
  @admin.display(description='code')
  def get_short_code(self, obj):
    if len(obj.code) > 30:
      return obj.code[:30] + "..."
    else :
      return obj.code
  @admin.display(description='message')
  def get_short_message(self, obj):
    if len(obj.message) > 30:
      return obj.message[:30] + "..."
    else :
      return obj.message

class ReviewAdmin(admin.ModelAdmin):
  search_fields = ["id"]
  list_display = ("id", "get_short_code", "get_short_message", "target")
  
  @admin.display(description='code')
  def get_short_code(self, obj):
    if len(obj.code) > 30:
      return obj.code[:30] + "..."
    else :
      return obj.code
  @admin.display(description='message')
  def get_short_message(self, obj):
    if len(obj.message) > 30:
      return obj.message[:30] + "..."
    else :
      return obj.message

class CommentAdmin(admin.ModelAdmin):
  search_fields = ["id"]
  list_display = ("id", "get_short_code", "get_short_message", "target")
  
  @admin.display(description='code')
  def get_short_code(self, obj):
    if len(obj.code) > 30:
      return obj.code[:30] + "..."
    else :
      return obj.code
  @admin.display(description='message')
  def get_short_message(self, obj):
    if len(obj.message) > 30:
      return obj.message[:30] + "..."
    else :
      return obj.message

class DeadcodeAdmin(admin.ModelAdmin):
  search_fields = ["id"]
  list_display = ("id", "get_short_code", "get_short_message", "target")
  
  @admin.display(description='code')
  def get_short_code(self, obj):
    if len(obj.code) > 30:
      return obj.code[:30] + "..."
    else :
      return obj.code
  @admin.display(description='message')
  def get_short_message(self, obj):
    if len(obj.message) > 30:
      return obj.message[:30] + "..."
    else :
      return obj.message

class CommitAdmin(admin.ModelAdmin):
  search_fields = ["id"]
  list_display = ("id", "repo_name", "get_short_message", "user_id", "create_at")

  @admin.display(description='commit_message')
  def get_short_message(self, obj):
    if len(obj.commit_message) > 30:
      return obj.commit_message[:30] + "..."
    else :
      return obj.commit_message

admin.site.register(Refactor, RefactorAdmin)
admin.site.register(Review, ReviewAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Deadcode, DeadcodeAdmin)
admin.site.register(Commit, CommitAdmin)
