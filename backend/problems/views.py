from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework.views import APIView
import json

class ProblemListView(APIView):
    def get(self, request):
        return Response(None)