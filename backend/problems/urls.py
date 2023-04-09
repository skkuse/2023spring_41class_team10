from django.urls import path
from problems import views, views_sample
app_name = 'problems'
urlpatterns = [
    # 학생 id로 접속시도하면 /user/{username} 으로 리다이렉트
    path('v0/list', views_sample.ProblemListView.as_view(), name='ProblemListSample'),
    path('v1/list', views.ProblemListView.as_view(), name='ProblemList'),
]
