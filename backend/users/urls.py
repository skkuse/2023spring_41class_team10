from django.urls import path
from lectures import views
from users import views_history

app_name = 'users'
urlpatterns = [
    path('v1/lectures/guideline/', views.LectureGuideRecommendView.as_view(), name='lecture_guideline'),
    path('v1/lectures/history/', views_history.LectureHistoryView.as_view(), name='lecture_history'),   
    path('v1/lectures/history/save/', views_history.LectureHistorySaveView.as_view(), name='lecture_history_save'),
    path('v1/problems/', views_history.SubmissionHistoryView.as_view(), name='user_problem_history'),
    path('v1/problems/<id>/', views_history.SubmissionCodeView.as_view(), name='user_problem'),
]
