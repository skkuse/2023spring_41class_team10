from rest_framework.response import Response
from rest_framework.views import APIView

import json
import re
import time
import logging

from problems.models import Problem, Testcase, Submission

# def index(request):
#     return HttpResponse("Hello, world. You're at the problems index.")

class ProblemListView(APIView):
    def get(self, request):
        return Response(None)


class ProblemSubmitView(APIView):
    """ 유저 코드 제출
    url        : problems/v1/<problem_id>/submit/
    Returns :
        POST     : id, num_tc, num_pass, exec_time, result
    """
    def post(self, request, *args, **kwargs):
        print("ProblemSubmitView")
        # url 파라미터 problem_id 저장
        problem_id = kwargs.get('problem_id')
        res = {"id":problem_id, "num_tc": 0, "num_pass":0, "exec_time":-1, "result":""}
        
        # json data 파싱하여 code와 language 저장
        body = json.loads(request.body.decode('utf-8'))
        code = body.get("code", "")
        lang = body.get("lang", "python")
        
        # 코드 안전성 체크
        is_safe = check_safe_code(code, lang)
        if not is_safe:
            res["result"] = "Violation"
            return Response(res)

        # 문제와 테스트케이스 조회
        try:
            problem = Problem.objects.get(id=problem_id)
            testcases = Testcase.objects.filter(problem=problem)
        except Exception as e:
            logging.exception(f"[ProblemSubmitView] {e}")
            res["result"] = "Not Found"
            return Response(res)
            
        num_testcase = len(testcases)
        res["num_tc"] = num_testcase
        # TODO: Execute Code

        # TODO: Create Submit History
        return Response(res)


def check_safe_code(code, lang):
    """ code와 lang을 받아서 해당 코드가 시스템에 손상을 줄 수 있는지 여부를 확인하여 문제가 있다면 true를 리턴하고 문제가 있다면 false를 리턴해야한다. lang에 따라 서로 다른 서브 함수를 사용하여 안전성을 검증한다.

    Args:
        code (str): 유저가 입력한 프로그래밍 코드
        lang (str): 유저가 선택한 프로그래밍 언어

    Returns:
        bool: 안전한 코드 여부
    """
    is_safe = False
    if lang.lower() == "python":
        is_safe = check_safe_python(code)
    elif lang.lower() == "c":
        pass
    elif lang.lower() == "cpp":
        pass
    elif lang.lower() == "java":
        pass

    return is_safe

def check_safe_python(code):
    # 파이썬 코드에서 위협 패턴을 찾아 검증
    # threat_patterns: ChatGPT가 제안한 위협 패턴 목록  
    threat_patterns = [
            r'subprocess\.',  # 외부 프로세스 실행
            r'os\.',  # 운영 체제 기능 호출
            r'shutil\.',  # 파일 및 디렉토리 조작
            r'eval\(',  # eval 함수 사용
            r'exec\(',  # exec 함수 사용
            r'open\(',  # 파일 시스템 엑세스
            r'__import__\(',  # 모듈 동적 로딩
            r'pickle\.'  # 객체 직렬화
        ]

    # 위협 패턴 확인
    for pattern in threat_patterns:
        if re.search(pattern, code):
            print(f"Find threat_patterns {pattern}")
            return False

    return True
