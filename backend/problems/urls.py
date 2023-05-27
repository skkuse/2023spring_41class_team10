from django.urls import path
from problems import views, views_sample, views_desc

app_name = 'problems'
urlpatterns = [
    # 문제 리스트 API
    path('v0/list', views_sample.ProblemListView.as_view(), name='ProblemListSample'),
    path('v1/list', views.ProblemListView.as_view(), name='ProblemList'),
    path('v1/<id>/', views_desc.ProblemDescView.as_view(), name='problem_desc'),
    path('v1/<id>/exec/', views_desc.ProblemExecView.as_view(), name='problem_exec'),
    path('v1/<id>/save/', views_desc.ProblemCodeSaveView.as_view(), name='problem_code_save'),
    path('v1/<problem_id>/submit/', views.ProblemSubmitView.as_view(), name='problem_submit')
]
