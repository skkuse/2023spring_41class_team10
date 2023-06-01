from django.urls import path

from codes import views
app_name = 'codes'

urlpatterns = [
    path('v1/refactoring/', views.ChatRefactorAPIView.as_view(), name='refactor_api'),
    path('v1/review/', views.ChatReviewAPIView.as_view(), name='review_api'),
    path('v1/comment/', views.ChatAddCommentAPIView().as_view(), name='add_comment_api'),
    path('v1/deadcode/', views.ChatDeadcodeAPIView().as_view(), name='deadcode_api'),
]
