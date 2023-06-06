from django.urls import path
from boards import views

app_name = 'boards'
urlpatterns = [
    path('v1/notice/list/', views.NoticeListView.as_view(), name='notice_list'),
    path('v1/faq/list/', views.FAQListView.as_view(), name='FAQ_list'),
]
