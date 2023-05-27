from rest_framework.response import Response
from rest_framework.views import APIView
from backend.settings import BASE_DIR

import json
import os

class ProblemListView(APIView):
    def get(self, request):
        # 문제 리스트 json 파일 읽기
        path = os.path.join(BASE_DIR, "problems/data/problem_list.json")

        with open(path, 'r') as f:
            problem_list = json.load(f)

        # 응답 데이터 생성
        response_data = {
            'status': "success",
            'count': len(problem_list),
            'data': problem_list
        }

        return Response(response_data)
