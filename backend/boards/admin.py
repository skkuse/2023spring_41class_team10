from django.contrib import admin
from .models import Board, Article
from import_export.admin import ImportExportMixin

class BoardAdmin(ImportExportMixin, admin.ModelAdmin):
  search_fields = ["id", "title"]
  list_display = ("id", "get_short_title", "create_at")
  @admin.display(description='title')
  def get_short_title(self, obj):
    if len(obj.title) > 20:
      return obj.title[:20] + "..."
    else :
      return obj.title

class ArticleAdmin(ImportExportMixin, admin.ModelAdmin):
  search_fields = ["id", "title", "board"]
  list_display = ("id", "get_short_title", "get_short_body", "board", "author_id", "create_at", "update_at")
  @admin.display(description='title')
  def get_short_title(self, obj):
    if len(obj.title) > 20:
      return obj.title[:20] + "..."
    else :
      return obj.title
  @admin.display(description='body')
  def get_short_body(self, obj):
    if len(obj.body) > 20:
      return obj.body[:20] + "..."
    else :
      return obj.body

admin.site.register(Board, BoardAdmin)
admin.site.register(Article, ArticleAdmin)
