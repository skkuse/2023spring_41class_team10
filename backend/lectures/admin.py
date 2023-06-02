from django.contrib import admin
from .models import Lecture, SoftwareField, LectureFieldRelation, LectureHistory
from import_export.admin import ImportExportMixin

class LectureAdmin(ImportExportMixin, admin.ModelAdmin):
  search_fields = ["id", "title"]
  list_display = ("id", "title", "video_link", "author_id", "create_at")

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
  list_display = ("id", "get_lecture", "user_id", "create_at")
  @admin.display(description='lecture', ordering='lecture__title')
  def get_lecture(self, obj):
    return obj.lecture.title 

admin.site.register(Lecture, LectureAdmin)
admin.site.register(SoftwareField, SoftwareFieldAdmin)
admin.site.register(LectureFieldRelation, LectureFieldRelationAdmin)
admin.site.register(LectureHistory, LectureHistoryAdmin)
