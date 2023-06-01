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
    
    def post(self, request):
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        user_id = body.get("user_id", "")
        user = User.objects.get(id=user_id)

        N=5

        body = json.loads(request.body.decode('utf-8'))
        
        
        
        # 임시로 랜덤함수 이용해 선택
        lectures = Lecture.objects.all()
        rids = random.sample(range(1, len(lectures)), 5)
        targets = lectures.filter(id__in=rids)
        lecture_list = []
        for lecture in targets:
            data = {
                "user_id" : lecture.author_id,
                "lecture_link" : lecture.video_link,
                "lecture_title":lecture.title 
            }
            lecture_list.append(data)

        response_data = {
            "status" : "success",
            "message" : "랜덤하게 추천되었습니다.",
            "data" : lecture_list,
            "user" : user
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