from django.urls import path

from codes.views import ChatRefactorAPIView
app_name = 'codes'

urlpatterns = [
    path('api/v1/refactoring/', ChatRefactorAPIView.as_view(), name='refactor_api'),
]
