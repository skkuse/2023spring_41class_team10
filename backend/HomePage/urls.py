from django.urls import path

from . import views

urlpatterns = [
    # /HomePage/
    path('', views.index, name='index'),
    # /HomePage/5/
    path('<int:question_id>/', views.detail, name="detail")
]