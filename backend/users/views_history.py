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
    
        filtered_histories = UserCodeHistory.objects.filter(user=user_id)
        if not filtered_histories.exists():
            return Response(get_fail_res("History does not exists"))


        

        code_histories = []
        titles = []
        for history in filtered_histories:
            if history.problem.title not in titles:
                # code_histories.append({
                #     "user_id" : user_id,
                #     "title" : history.problem.title,
                #     "problem_id" : history.problem.id,
                #     "submit_at" : history.create_at,
                #     "result" : "test"
                # })
                data = {
                    "user_id" : user_id,
                    "title" : history.problem.title,
                    "problem_id" : history.problem.id,
                    "submit_at" : history.create_at,
                    "result" : "temp"
                }
                # submit = Submission.objects.filter(user=user_id, problem=history.problem, create_at=history.create_at)
                latest_submit = Submission.objects.filter(user=user_id, problem=history.problem).aggregate(max_create_at=Max('create_at'))
                latest_create_at = latest_submit['max_create_at']
                submit = Submission.objects.filter(user=user_id, problem=history.problem, create_at=latest_create_at).first()

                # if not submit.exists():
                    # return Response(get_fail_res("Submission history does not exists"))
                    
                # for sub in submit:
                    # data["result"] = sub.status
                data["result"] = submit.status
                code_histories.append(data)
            else:
                for hist in code_histories:
                    if hist["title"] == history.problem.title:
                        hist["submit_at"] = history.create_at
                        # submit = Submission.objects.filter(user=user_id, problem=history.problem, create_at=history.create_at)
                        latest_submit = Submission.objects.filter(user=user_id, problem=history.problem).aggregate(max_create_at=Max('create_at'))
                        latest_create_at = latest_submit['max_create_at']
                        submit = Submission.objects.filter(user=user_id, problem=history.problem, create_at=latest_create_at).first()
                        hist["result"] = submit.status
                        # if not submit.exists():
                        #     return Response(get_fail_res("Submission history does not exists"))
                        # for sub in submit:
                        #     hist["result"] = sub.status
            titles.append(history.problem.title)

        response_data = {
                "status": "200",
                "message": "Success",
                "data": code_histories
            }
        return Response(response_data)
    
class LectureHistoryView(APIView):

    def get(self, request):
        user_id = 1

        
        filtered_histories = LectureHistory.objects.filter(user_id=user_id)
        if not filtered_histories.exists():
            return Response(get_fail_res("History does not exists"))

        lecture_list = []

        for history in filtered_histories:
            lecture_obj = {}
            lecture_obj["user_id"] = user_id
            lecture_obj["link"] = history.lecture.video_link
            lecture_obj["title"] = history.lecture.title
            lecture_list.append(lecture_obj)

        response_data = {
            "status": "200",
            "message": "Success",
            "data" : lecture_list
        }

        return Response(response_data)