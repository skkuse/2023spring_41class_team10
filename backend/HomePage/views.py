from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework.views import APIView
import json
from HomePage.models import Problem


# Create your views here.
def index(request):
    # problem = Problem(0,"test",1,"for test")
    # problem = Problem(1,"a와 b 출력하기",0,"문자열 str이 주어질 때, str을 출력하는 코드를 작성해 보세요.")

    # problem.save()
    return HttpResponse("Hello, world. You're at the HomePage index.")

class ProblemListView(APIView):
    def get(self, request):
        return Response(None)