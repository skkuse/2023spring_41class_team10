"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from users import views
urlpatterns = [
    path('', lambda req: redirect('/login/')),
    path('admin/', admin.site.urls),
    path('login/', views.LoginView.as_view(), name='github_login_callback'),
    path('login/github/callback/', views.GitHubLoginView.as_view(), name='github_login_callback'),
    path('problems/', include('problems.urls')),
    path('codes/', include('codes.urls')),
    path('users/', include('users.urls'))
]
