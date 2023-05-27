from django.urls import path
from problems import views, views_sample
app_name = 'problems'
urlpatterns = [
    # 문제 리스트 API
    path('v0/list', views_sample.ProblemListView.as_view(), name='ProblemListSample'),
    path('v1/list', views.ProblemListView.as_view(), name='ProblemList'),
]
