from rest_framework.response import Response
from rest_framework.views import APIView

from boards.models import Article

def get_fail_res(msg):
    """ 
    Create fail Response
    """
    return {
        'status': "fail",
        'message': msg
    }

class NoticeListView(APIView):
    """ Notice List View
    url        : boards/v1/notie/list/
    Returns :
        GET     : id, problem_title, algorithm_field, level
    """
    def get(self, request):
        page = request.GET.get('page', 1)
        page = int(page)
        PAGE_SIZE = 5

        articles = Article.objects.filter(board__title="Notice").order_by('-create_at')

        if not articles.exists():
            return Response(get_fail_res("NoticeListView Failed!: Any notice in Article Table"))
        articles = list(articles[PAGE_SIZE * (page - 1):PAGE_SIZE * (page)])
        article_list = [ article.to_json() for article in articles]

        response_data = {
            "status": "success",
            "message": "Problem List Info",
            "data": article_list,
        }

        return Response(response_data)

class FAQListView(APIView):
    """ FAQ List View
    url        : boards/v1/faq/list/
    Returns :
        GET     : id, problem_title, algorithm_field, level
    """
    def get(self, request):
        page = request.GET.get('page', 1)
        page = int(page)
        PAGE_SIZE = 5

        # Problem 모델에서 모든 객체를 가져온다.
        articles = Article.objects.filter(board__title="FAQ").order_by('-create_at')

        if not articles.exists():
            return Response(get_fail_res("FAQListView Failed!: Any FAQ in article Table"))
        articles = list(articles[PAGE_SIZE * (page - 1):PAGE_SIZE * (page)])
        article_list = [ article.to_json() for article in articles]

        response_data = {
            "status": "success",
            "message": "Problem List Info",
            "data": article_list,
        }

        return Response(response_data)
