from django.contrib import admin
from .models import Problem, AlgorithmField, ProblemFieldRelation, Testcase, Execution, Submission, UserCodeHistory


class ProblemAdmin(admin.ModelAdmin):
  search_fields = ["id", "title", "level"]
  list_display = ("id", "title", "level", "get_short_desc", "create_at")
  @admin.display(description='description')
  def get_short_desc(self, obj):
    if len(obj.description) > 20:
      return obj.description[:20] + "..."
    else :
      return obj.description

class AlgorithmFieldAdmin(admin.ModelAdmin):
  search_fields = ["id", "field"]
  list_display = ("id", "field")

class ProblemFieldRelationAdmin(admin.ModelAdmin):
  search_fields = ["id", "field__field", "problem__title"]
  list_display = ("id", "get_field", "get_problem")
  @admin.display(description='field', ordering='field__field')
  def get_field(self, obj):
    return obj.field.field
  @admin.display(description='problem', ordering='problem__title')
  def get_problem(self, obj):
    return obj.problem.title

class TestcaseAdmin(admin.ModelAdmin):
  search_fields = ["id", "problem__title", "is_sample"]
  list_display = ("id", "get_problem", "testcase", "result", "is_sample")
  @admin.display(description='problem', ordering='problem__title')
  def get_problem(self, obj):
    return obj.problem.title

class ExecutionAdmin(admin.ModelAdmin):
  search_fields = ["id", "problem__title", "lang", "status", "user"]
  list_display = ("id", "get_problem", "lang", "create_at", "status", "exec_time", "user", "get_short_result")
  @admin.display(description='problem', ordering='problem__title')
  def get_problem(self, obj):
    return obj.problem.title
  @admin.display(description='result')
  def get_short_result(self, obj):
    if len(obj.result) > 20:
      return obj.result[:20] + "..."
    else :
      return obj.result

class SubmissionAdmin(admin.ModelAdmin):
  search_fields = ["id", "problem__title", "lang", "status", "user"]
  list_display = ("id", "get_problem", "lang", "create_at", "status", "exec_time", "user", "num_pass", "get_short_code")
  @admin.display(description='problem', ordering='problem__title')
  def get_problem(self, obj):
    return obj.problem.title
  @admin.display(description='code')
  def get_short_code(self, obj):
    if len(obj.code) > 30:
      return obj.code[:30] + "..."
    else :
      return obj.code

class UserCodeHistoryAdmin(admin.ModelAdmin):
  search_fields = ["id", "user", "problem__title", "version", "user", "lang"]
  list_display = ("id", "user", "get_problem", "version", "get_short_code", "memo", "create_at", "lang")
  @admin.display(description='problem', ordering='problem__title')
  def get_problem(self, obj):
    return obj.problem.title
  @admin.display(description='code')
  def get_short_code(self, obj):
    if len(obj.code) > 30:
      return obj.code[:30] + "..."
    else :
      return obj.code
  @admin.display(description='memo')
  def get_short_memo(self, obj):
    if len(obj.memo) > 20:
      return obj.memo[:20] + "..."
    else :
      return obj.memo

admin.site.register(Problem, ProblemAdmin)
admin.site.register(AlgorithmField, AlgorithmFieldAdmin)
admin.site.register(ProblemFieldRelation, ProblemFieldRelationAdmin)
admin.site.register(Testcase, TestcaseAdmin)
admin.site.register(Execution, ExecutionAdmin)
admin.site.register(Submission, SubmissionAdmin)
admin.site.register(UserCodeHistory, UserCodeHistoryAdmin)
