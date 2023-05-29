from rest_framework.response import Response
from rest_framework.views import APIView
from backend.settings import BASE_DIR

import json
import os

from lectures.models import LectureHistory
from problems.models import UserCodeHistory

def get_fail_res(msg):
    """ 
    Create fail Response
    """
    return {
        'status': "fail",
        'message': msg
    }

class ProblemLoadView(APIView):

    def get(self, request, id):
        try:
            target_history = UserCodeHistory.objects.get(id=id)      
        except UserCodeHistory.DoesNotExist:
            return Response(get_fail_res("History Does not Exist"))
        
        response_data = {
                "id" : target_history.id,
                "code" : target_history.code
            }
        return Response(target_history)