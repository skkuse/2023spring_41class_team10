from rest_framework.response import Response
from rest_framework.views import APIView
from backend.settings import BASE_DIR

import json
import os
import random

from lectures.models import *
from users.models import User

def get_fail_res(msg):
    """ 
    Create fail Response
    """
    return {
        'status': "fail",
        'message': msg
    }
    
class LectureGuideRecommendView(APIView):
    
    def get(self, request):
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        user_id = request.user.id
        user = User.objects.get(id=user_id)

        N = request.GET.get('n', 4)
        message = ""
        lecture_list = []

        recommends = LectureRecommend.objects.filter(user_id=user_id).order_by("-create_at")[:N]
        if len(recommends) > 0:
            for recommend in recommends:
                data = recommend.lecture.to_json()
                data["user_id"] = user_id
                lecture_list.append(data)
            message = "맞춤 추천 강의"
        else:
            # 임시로 랜덤함수 이용해 선택
            lecture_ids = Lecture.objects.exclude(memo="").values_list("id", flat=True)
            if len(lecture_ids) < N:
                lecture_ids = Lecture.objects.all().values_list("id", flat=True)
            rids = random.sample(list(lecture_ids), N)
            targets = Lecture.objects.filter(id__in=rids)
            for lecture in targets:
                data = lecture.to_json()
                data["user_id"] = user_id
                lecture_list.append(data)
            message = "랜덤 추천 강의"

        response_data = {
            "status" : "success",
            "message" : message,
            "data" : lecture_list,
            "user" : user.to_json()
        }

        return Response(response_data)


class LectureHistoryView(APIView):
    
    def post(self, request):
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        user_id = request.user.id
        user = User.objects.get(id=user_id)
        
        # Check whether the user's history exists
        user_history = LectureHistory.objects.filter(user_id = user_id)
        lecutre_list = []
        
        # If user's history exists, make lecture_list for Response
        # lecture_list [ lecture_obj1, lecture_obj2, lecture_obj3, .... ]
        for uh in user_history:
            lecture_obj = {}
            lecture_obj["user_id"] = user_id
            lecture_obj["link"] = uh.lecture.video_link
            lecture_obj["title"] = uh.lecture.title
            lecture_obj["lecture_id"] = uh.lecture.id
            lecutre_list.append(lecture_obj)

        # Success Response Data
        response_data = {
            "status" : "Success",
            "message" : "User's Lecture Hisotry Info",
            "data" : lecutre_list,
            "user" : user
        }

        return Response(response_data)

# For User's Lecture History Save
class LectureHistorySaveView(APIView):
    def post(self, request):
        # lecture_id by parsing json data 
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        user_id = request.user.id
        user = User.objects.get(id=user_id)
        body = json.loads(request.body.decode('utf-8'))
        lecture_id = body.get("lecture_id", "")

        # Check whether the Lecture exists
        try:
            selected_lecture = Lecture.objects.get(id=lecture_id)
        except Lecture.DoesNotExist:
            return Response(get_fail_res("LectureHistorySaveView Failed!: Selected Lecture not exist!"))

        # Create User's Lecture History
        LectureHistory.objects.create(
            lecture = selected_lecture,
            user_id = user_id
        )

        # Success Response Data
        response_data = {
            "status": "success",
            "message": "Save Lecture Hisotry of User",
            "user": user
        }

        return Response(response_data)
