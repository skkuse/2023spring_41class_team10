from rest_framework.response import Response
from rest_framework.views import APIView
from backend.settings import BASE_DIR

import json
import os

from lectures.models import *
from problems.models import *
from django.db.models import Max

def get_fail_res(msg):
    """ 
    Create fail Response
    """
    return {
        'status': "400",
        'message': msg
    }


class ProblemLoadView(APIView):

    def get(self, request):
        # id: problem id
        user_id = 1
        # try:
        #     target_problem = Problem.objects.get(id=id)
        # except Problem.DoesNotExist:
        #     return Response(get_fail_res("Problem does not exists"))
        
        filtered_histories = UserCodeHistory.objects.filter(user=user_id)
        if not filtered_histories.exists():
            return Response(get_fail_res("History does not exists"))

        code_histories = []
        for history in filtered_histories:
            code_histories.append(history)

        response_data = {
                "status": "200",
                "message": "Success",
                "data": code_histories
                # "data": {
                    # "user_id" : user_id,
                    # "title" :  
                    # "id" : target_problem.id,
                    # "code" : code

                # }
            }
        return Response(response_data)
    
class LectureHistoryView(APIView):

    def get(self, request):
        # id: user id
        user_id = 1
        # try:
            # target_lectures = Lecture.objects.get(id=id)
        # except Lecture.DoesNotExist:
            # return Response(get_fail_res("Problem does not exists"))
        
        filtered_histories = LectureHistory.objects.filter(user_id=user_id)
        if not filtered_histories.exists():
            return Response(get_fail_res("History does not exists"))

        target_lectures = []

        for history in filtered_histories:
            target_lectures.append(history.lecture)

        response_data = {
            "status": "200",
            "message": "Success",
            "data" : target_lectures
        }

        return Response(response_data)