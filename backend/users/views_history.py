from rest_framework.response import Response
from rest_framework.views import APIView

from lectures.models import *
from problems.models import *

def get_fail_res(msg):
    """ 
    Create fail Response
    """
    return {
        'status': "400",
        'message': msg
    }


class SubmissionHistoryView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        
        LIMIT = 5
        # user의 제출 history 조회, 제출을을 내림차순으로 정렬
        user_id = request.user.id
        user_submissions = Submission.objects.filter(user=user_id).order_by("-create_at")

        data = []
        for submission in user_submissions[:LIMIT]:
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
            "data": data
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
