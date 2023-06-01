from django.urls import path

from codes.views import ChatRefactorAPIView
app_name = 'codes'

urlpatterns = [
    path('v1/refactoring/', ChatRefactorAPIView.as_view(), name='refactor_api'),
    path('v1/review/', ChatReviewAPIView.as_view(), name='review_api'),
    path('v1/comment/', ChatAddCommentAPIView(), name='add_comment_api'),
    path('v1/deadcode/', ChatDeadcodeAPIView(), name='deadcode_api'),
]
