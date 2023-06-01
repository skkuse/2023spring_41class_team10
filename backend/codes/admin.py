from django.contrib import admin
from .models import Refactor

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

admin.site.register(Refactor, RefactorAdmin)
