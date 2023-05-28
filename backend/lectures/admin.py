from django.contrib import admin
from .models import Lecture, SoftwareField, LectureFieldRelation, LectureHistory

class LectureAdmin(admin.ModelAdmin):
    search_fields = ["id", "title", "author_id"]
    list_display = ("id", "title", "get_short_video_link", "author_id", "create_at")
    @admin.display(description='video_link')
    def get_short_video_link(self, obj):
        if len(obj.video_link) > 30:
            return obj.video_link[:30] + "..."
        else:
            return obj.video_link

class SoftwareFieldAdmin(admin.ModelAdmin):
    search_fields = ["id", "field"]
    list_display = ("id", "field")

class LectureFieldRelationAdmin(admin.ModelAdmin):
    search_fields = ["id", "field__field", "lecutre__title"]
    list_display = ("id", "get_field", "get_lecture")
    @admin.display(description='field', ordering='softwarefield__field')
    def get_field(self, obj):
        return obj.field.field
    @admin.display(description='lecture', ordering='lecture__lecture')
    def get_lecture(self, obj):
        return obj.lecture.title

class LectureHistoryAdmin(admin.ModelAdmin):
    search_fields = ["id", "user_id", "lecture_title"]
    list_display = ("id", "user_id", "get_lecture", "create_at")
    @admin.display(description='lecture', ordering='lecturehistory__lecture')
    def get_lecture(self, obj):
        return obj.lecture.title
    
    
admin.site.register(Lecture, LectureAdmin)
admin.site.register(SoftwareField, SoftwareFieldAdmin)
admin.site.register(LectureFieldRelation, LectureFieldRelationAdmin)
admin.site.register(LectureHistory, LectureHistoryAdmin)