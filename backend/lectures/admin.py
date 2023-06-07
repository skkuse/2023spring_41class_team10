from django.contrib import admin
from .models import Lecture, SoftwareField, LectureFieldRelation, LectureHistory, LectureRecommend, LectureComment
from import_export.admin import ImportExportMixin

class LectureAdmin(ImportExportMixin, admin.ModelAdmin):
  search_fields = ["id", "title"]
  list_display = ("id", "title", "video_link", "author_id", "create_at", "memo")
  def get_short_memo(self, obj):
    if len(obj.memo) > 30:
      return obj.memo[:30] + "..."
    else :
      return obj.memo

class SoftwareFieldAdmin(ImportExportMixin, admin.ModelAdmin):
  search_fields = ["id", "field"]
  list_display = ("id", "field")

class LectureFieldRelationAdmin(ImportExportMixin, admin.ModelAdmin):
  search_fields = ["id", "field__field", "lecture__title"]
  list_display = ("id", "get_lecture", "get_field")

  @admin.display(description='lecture', ordering='lecture__title')
  def get_lecture(self, obj):
    return obj.lecture.title 
  @admin.display(description='field', ordering='field__field')
  def get_field(self, obj):
    return obj.field.field 

class LectureHistoryAdmin(ImportExportMixin, admin.ModelAdmin):
  search_fields = ["id", "lecture__title"]
  list_display = ("id", "user_id", "get_lecture", "create_at")
  @admin.display(description='lecture', ordering='lecture__title')
  def get_lecture(self, obj):
    return obj.lecture.title 

class LectureRecommendAdmin(ImportExportMixin, admin.ModelAdmin):
  search_fields = ["id", "lecture__title"]
  list_display = ("id", "user_id", "get_lecture", "create_at")
  @admin.display(description='lecture', ordering='lecture__title')
  def get_lecture(self, obj):
    return obj.lecture.title

class LectureCommentAdmin(ImportExportMixin, admin.ModelAdmin):
  search_fields = ["id", "lecture__title"]
  list_display = ("id", "get_lecture", "get_short_comment", "create_at")
  @admin.display(description='lecture', ordering='lecture__title')
  def get_lecture(self, obj):
    return obj.lecture.title
  @admin.display(description='comment')
  def get_short_comment(self, obj):
    if len(obj.comment) > 20:
      return obj.comment[:20] + "..."
    else :
      return obj.comment

admin.site.register(Lecture, LectureAdmin)
admin.site.register(SoftwareField, SoftwareFieldAdmin)
admin.site.register(LectureFieldRelation, LectureFieldRelationAdmin)
admin.site.register(LectureHistory, LectureHistoryAdmin)
admin.site.register(LectureRecommend, LectureRecommendAdmin)
admin.site.register(LectureComment, LectureCommentAdmin)
