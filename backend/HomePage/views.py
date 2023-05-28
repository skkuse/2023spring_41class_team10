from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework.views import APIView
import json
from HomePage.models import Problem
from django.template import loader


# Create your views here.
def index(request):
    # return HttpResponse("Hello, world. You're at the HomePage index.")
    template = loader.get_template('HomePage/index.html')
    data = Problem.objects.order_by('id')[0]
    context = {
        'data' : data,
    }
    return HttpResponse(template.render(context, request))


def detail(request, question_id):
    return HttpResponse(response % question_id)

class ProblemListView(APIView):
    def get(self, request):
        return Response(None)