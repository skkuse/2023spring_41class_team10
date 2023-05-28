from rest_framework.response import Response
from rest_framework.views import APIView
from backend.settings import BASE_DIR

import json
import os

from lectures.models import *

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
        body = json.loads(request.body.decode('utf-8'))
        
        user_id = body.get("user_id", "")
        
        
        
        # response_data = {
        #     "user_id" : user_id,
        #     "lecture_link" : ,
        #     "lecture_title" : 
        # }
        
        # return Response(response_data)



class LectureHistoryView(APIView):
    
    def post(self, request):
        # store user_id by parsing json data 
        body = json.loads(request.body.decode('utf-8'))
        
        user_id = body.get("user_id", "")
        
        # Check whether the user's history exists
        user_history = LectureHistory.objects.filter(user_id = user_id)
        lecutre_list = []
        
        # If user's history exists, make lecture_list for Response
        # lecture_list [ lecture_obj1, lecture_obj2, lecture_obj3, .... ]
        if user_history.exists():
            for uh in user_history:
                lecture_obj = {}
                lecture_obj["user_id"] = user_id
                lecture_obj["link"] = uh.lecture.video_link
                lecture_obj["title"] = uh.lecture.title
                lecutre_list.append(lecture_obj)
        # User's history not exist
        else:
            return Response(get_fail_res("LectureHistory Failed!: Don't exist History of User"))
        
        # Success Response Data
        response_data = {
            "status": "Success",
            "message": "User's Lecture Hisotry Info",
            "data": lecutre_list
        }
        
        return Response(response_data)

# For User's Lecture History Save
class LectureHistorySaveView(APIView):
    def post(self, request):
        # store user_id, lecture_title by parsing json data 
        body = json.loads(request.body.decode('utf-8'))
        
        user_id = body.get("user_id", "")
        lecture_title = body.get("lecture_title", "")
        
        # When user_id is empty
        if user_id == "":
            return Response(get_fail_res("LectureHistorySaveView Failed!: User_id is empty!"))
        
        # Check whether the Lecture exists
        try:
            selected_lecture = Lecture.objects.get(title = lecture_title)
        except Lecture.DoesNotExist:
            return Response(get_fail_res("LectureHistorySaveView Failed!: Selected Lecture not exist!"))
        
        # Create User's Lecture History
        LectureHistory.objects.create(
            lecture = selected_lecture,
            user_id = user_id
        )
        
        # Success Response Data
        response_data = {
            "status": "Success",
            "message": "Save Lecture Hisotry of User",
        }
        
        return Response(response_data)