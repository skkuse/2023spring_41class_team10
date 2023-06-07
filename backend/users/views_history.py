from rest_framework.response import Response
from rest_framework.views import APIView

from lectures.models import Lecture, LectureHistory
from problems.models import Submission, ProblemFieldRelation
from users.models import User

import logging
import json
import pytz

def get_fail_res(msg):
    """ 
    Create fail Response
    """
    return {
        'status': "fail",
        'message': msg
    }


class SubmissionHistoryView(APIView):
    """유저의 제출내역 조회

    url        : users/v1/problems/
    Returns :
        GET   : list({user_id, title, problem_id, submit_at, result}]
    """
    def get(self, request):
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        user = User.objects.get(id=request.user.id)
        
        N = request.GET.get('n', 5)
        # user의 제출 history 조회, 제출을 내림차순으로 정렬
        user_id = request.user.id
        user_submissions = Submission.objects.filter(user=user_id).order_by("-create_at")

        data = []
        for submission in user_submissions[:N]:
            obj = {
                "user_id" : user_id,
                "title" : submission.problem.title,
                "problem_id" : submission.problem.id,
                "submit_at" : submission.create_at,
                "result" : submission.status
            }
            data.append(obj)

        response_data = {
            "status": "success",
            "message": f"recent {len(data)} submissions",
            "data": data,
            "user": user.to_json()
        }

        return Response(response_data)

class SubmissionCodeView(APIView):
    """유저의 제출내역 조회

    url        : users/v1/problems/<id>/
    Returns :
        GET   : list({user_id, title, problem_id, submit_at, result}]
    """
    def get(self, request, id):
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        user = User.objects.get(id=request.user.id)

        # user의 특정문제 제출 history 조회
        user_id = request.user.id
        user_submissions = Submission.objects.filter(user=user_id, problem__id=id, status="PASS").order_by("-create_at")

        if len(user_submissions) == 0:
            return Response(get_fail_res("유저가 통과하지 못한 문제입니다."))
        target = user_submissions.first()

        # 알고리즘 분류 조회
        fields = ProblemFieldRelation.objects.filter(problem=target.problem).values_list("field__field", flat=True)
        target_fields = list(fields)

        data = {
            "user_id" : user_id,
            "title" : target.problem.title,
            "problem_id" : target.problem.id,
            "level": target.problem.level,
            "lang" : target.lang,
            "field": target_fields,
            "submit_at" : target.create_at,
            "result" : target.status,
            "code" : target.code,
            "description": target.problem.description,
            "submission_id": target.id
        }

        response_data = {
            "status": "success",
            "message": f"problem {id} submissions",
            "data": data,
            "user": user.to_json()
        }

        return Response(response_data)

class LectureHistoryView(APIView):
    """유저의 강의 시청내역 조회

    url        : users/v1/lectures/history/
    Returns :
        GET   : list({user_id, title, link}]
    """
    def get(self, request):
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        user = User.objects.get(id=request.user.id)
        N = request.GET.get('n', 3)
        # user의 강의 기록을 조회
        user_id = request.user.id
        user_lecture_histories = LectureHistory.objects.filter(user_id=user_id).order_by("-create_at")

        data = []
        for history in user_lecture_histories[:N]:
            lecture_obj = {}
            lecture_obj["lecture_id"] = history.lecture.id
            lecture_obj["user_id"] = user_id
            lecture_obj["lecture_title"] = history.lecture.title
            lecture_obj["lecture_link"] = history.lecture.video_link
            # UTC => KST
            lecture_obj["create_at"] = history.create_at.astimezone(pytz.timezone('Asia/Seoul'))
            data.append(lecture_obj)

        response_data = {
            "status": "success",
            "message": f"recent {len(data)} views",
            "data" : data,
            "user" : user.to_json()
        }

        return Response(response_data)

class LectureHistorySaveView(APIView):
    """유저의 강의 시청내역 저장

    url        : users/v1/lectures/history/save/
    Returns :
        POST   : status, message
    """
    def post(self, request):
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        user_id = request.user.id
        user = User.objects.get(id=user_id)
        
        try:
            body = json.loads(request.body.decode('utf-8'))
            lecture_id = body.get("lecture_id")
            print("lecture_id", lecture_id)
            lecture = Lecture.objects.get(id=lecture_id)
            LectureHistory.objects.create(lecture=lecture, user_id=user_id)
        except Exception as e:
            logging.exception(f"[LectureHistoryCreateView] {e}")
            return Response(get_fail_res("lecture error"))
        response_data = {
            "status": "success", 
            "message": f"{user_id}, {lecture.title}", 
            "user": user.to_json()
        }

        return Response(response_data)
