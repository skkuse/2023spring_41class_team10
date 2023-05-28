from django.urls import path
from lectures import views

app_name = 'users'
urlpatterns = [
    # For Lectures
    path('v1/lectures/guideline/', views.LectureGuideRecommendView.as_view(), name='lecture_guideline'),
    path('v1/lectures/history/', views.LectureHistoryView.as_view(), name='lecture_history'),   
    path('v1/lectures/savehistory/', views.LectureHistorySaveView.as_view(), name='lecture_history_save')    
]
