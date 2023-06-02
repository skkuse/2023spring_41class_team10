from django.contrib.auth import views as auth_views, login
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from backend.settings import CLIENT_ID, CLIENT_SECRET
from users.models import User

import requests
import logging

def get_fail_res(msg):
    """ 
    fail Response 생성
    """
    return {
        'status': "fail",
        'message': msg,
        'data': None
    }

class LoginView(auth_views.LoginView):
    template_name='login.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        GITHUB_LOGIN_URL = f"https://github.com/login/oauth/authorize?client_id={CLIENT_ID}" if CLIENT_ID else None
        context.update({"type": 'sign', "GITHUB_LOGIN_URL": GITHUB_LOGIN_URL})
        return context

class GitHubLoginView(APIView):
    def get(self, request):
        code = request.GET.get('code')
        if code is None:
            return Response(get_fail_res("요청에서 code를 얻지 못했습니다."))
        # code 값을 이용해 access_token 발급
        access_token = get_access_token(code)
        if access_token is None:
            return Response(get_fail_res("GitHub에서 access_token을 얻지 못했습니다."))
        # access_token 값을 이용해 github email 조회
        primary_email = get_user_primary_email(access_token)
        print("primary_email", primary_email)
        # access_token 값을 이용해 github 유저 정보 조회
        user_info = get_user_info(access_token)
        print("user_info", user_info)
        
        if user_info is None:
            return Response(get_fail_res("GitHub에서 유저 정보를 얻지 못했습니다."))

        users = User.objects.filter(github_username=user_info['username'])

        if users.exists():
            try:
                # 유저가 존재하면 데이터 조회하여 반환
                user_account = users.first()
                # 접속일 업데이트
                user_account.login()

                token = RefreshToken.for_user(user_account) #simple jwt로 토큰 발급
                print("token", token)
                print("access_token", token.access_token)
                
                data = {
                    'user': user_account.to_json(),
                    'access_token': str(token.access_token),
                    'refresh_token': str(token),
                }
                return Response({"message": "로그인 성공", "data":data}, status=status.HTTP_200_OK)

            except Exception as e:
                logging.exception(f"[github_login_callback] user_account {e}")
                return Response(get_fail_res("GitHub에서 유저 정보를 얻지 못했습니다."), status=status.HTTP_400_BAD_REQUEST)
        else:
            # 유저가 존재하지 않으면 유저를 생성하여 데이터 반환
            user_account = User.objects.create_user(
                github_username=user_info['username'],
                username=user_info['username'],
                email=primary_email,
                profile_image_url=user_info['profile_image']
            )
            # 접속일 업데이트
            user_account.login()

            token = RefreshToken.for_user(user_account) #simple jwt로 토큰 발급
            print("token", token)
            print("access_token", token.access_token)
            
            data = {
                'user': user_account.to_json(),
                'access_token': str(token.access_token),
                'refresh_token': str(token),
            }
            return Response({"message": "로그인 성공", "data":data}, status=status.HTTP_200_OK)

def get_access_token(code):
    try:
        github_data = {"code":code}
        github_data["client_id"] = CLIENT_ID
        github_data["client_secret"] = CLIENT_SECRET

        HEADERS = {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        res = requests.post(
                    'https://github.com/login/oauth/access_token', 
                    data=github_data, headers=HEADERS)
        if res.status_code == 200:
            access_token = res.json()['access_token']
            refresh_token = res.json()['refresh_token']
            print('access_token', access_token)
            print('refresh_token', refresh_token)
            return access_token
        else:
            logging.error(f"[get_access_token] status error {res.status_code}")
            return None
    except Exception as e:
        logging.exception(f"[get_access_token] get_access_token error {e}")
        return None


def get_user_info(access_token):
    try:
        headers = {'Authorization': f'Bearer {access_token}'}
        res = requests.get('https://api.github.com/user', headers=headers)
        if res.status_code == 200:
            user_data = res.json()
            # user_data 파싱하여 username, email, 이미지 링크 획득
            username = user_data['login']
            email = user_data['email'] if 'email' in user_data else None
            profile_image = user_data['avatar_url']
            user_info = {'username': username, 'email': email, 'profile_image': profile_image}

            return user_info
        else:
            logging.error(f"[get_user_info] status error {res.status_code}")
            return None
    except Exception as e:
        logging.exception(f"[get_user_info] get_user_info error {e}")
        return None

def get_user_primary_email(access_token):
    headers = {'Authorization': f'token {access_token}'}
    res = requests.get('https://api.github.com/user/emails', headers=headers)
    primary_email = None

    if res.status_code == 200:
        emails = res.json()
        
        for email in emails:
            if email['primary']:
                primary_email = email['email']
                break
    else:
        logging.error(f"[get_user_primary_email] status error {res.status_code}")

    return primary_email


class UserInfoView(APIView):
    """
    users/v1/info/
    """
    def get(self, request):
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        user = User.objects.get(id=request.user.id)

        return Response({"user":user.to_json()})

class UserTargetInfoView(APIView):
    """
    users/v1/info/<id>
    """
    def get(self, request, id):
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        user = User.objects.get(id=request.user.id)
        target = User.objects.get(id=id)

        return Response({"data":target.to_json(), "user":user.to_json()})

class UserGitHubUsernameView(APIView):
    """
    users/v1/usernames/<github_username>
    """
    def get(self, request, github_username):
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        user = User.objects.get(id=request.user.id)
        target = User.objects.get(github_username=github_username)

        return Response({"data":target.to_json(), "user":user.to_json()})
