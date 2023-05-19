from rest_framework.response import Response
from rest_framework.views import APIView

from django.http import HttpResponse

from rest_framework.views import APIView
import json
# Create your views here.
def index(request):
    return HttpResponse("Hello, world. You're at the HomePage index.")

class ProblemListView(APIView):
    def get(self, request):
        return Response(None)