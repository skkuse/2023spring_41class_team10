from rest_framework.response import Response
from rest_framework.views import APIView

from django.http import HttpResponse

from rest_framework.views import APIView
import json

# def index(request):
#     return HttpResponse("Hello, world. You're at the problems index.")

class ProblemListView(APIView):
    def get(self, request):
        return Response(None)