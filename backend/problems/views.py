from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import DatabaseError, transaction
from django.db.models import Prefetch

import json
import re
import os
import time
import subprocess
import logging

from problems.models import Problem, Testcase, Submission, AlgorithmField, ProblemFieldRelation, UserCodeHistory, ProblemRecommend
from users.models import User
from backend.settings import EXECUTE_DIR

def get_fail_res(msg):
    """ 
    Create fail Response
    """
    return {
        'status': "fail",
        'message': msg
    }


class ProblemListView(APIView):
    """ Problem List View
    url        : problems/v1/list/
    Returns :
        GET     : id, problem_title, algorithm_field, level
    """
    def get(self, request):
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        user = User.objects.get(id=request.user.id)
        page = request.GET.get('page', 1)
        page = int(page)
        keyword = request.GET.get('q', "")
        PAGE_SIZE = 5

        # Problem 모델에서 페이지에 맞춰 가져온다.
        problems = Problem.objects
        if keyword != "":
            problems = problems.filter(title__contains=keyword)
        problems = problems.order_by('id')
        size = len(problems)

        # Prefetch를 사용하여 submission 쿼리 최적화
        submissions_prefetch = Prefetch(
            'submission_set',
            queryset=Submission.objects.filter(user=request.user.id),
            to_attr='submissions'
        )
        # Prefetch를 사용하여 ProblemFieldRelation 쿼리 최적화
        field_relations_prefetch = Prefetch(
            'problemfieldrelation_set',
            queryset=ProblemFieldRelation.objects.only('field__field'),
            to_attr='field_relations'
        )
        # Prefetch를 사용하여 ProblemRecommend 쿼리 최적화
        recommend_prefetch = Prefetch(
            'problemfieldrelation_set',
            queryset=ProblemRecommend.objects.filter(user_id=request.user.id),
            to_attr='recommend'
        )
        # problems에 submissions, field_relations 객체 속성 추가
        problems = problems.prefetch_related(submissions_prefetch, field_relations_prefetch, recommend_prefetch)
        problems = problems[PAGE_SIZE * (page - 1):PAGE_SIZE * (page)]

        problem_list = []
        for prob in problems:
            prob_obj = {}
            prob_obj["id"] = prob.id
            prob_obj["title"] = prob.title
            prob_obj["level"] = prob.level

            submissions = prob.submissions

            if len(submissions) == 0:
                if len(prob.recommend) == 0:
                    prob_obj['status'] = "uncomplete"
                else :
                    prob_obj['status'] = "ai"
            else:
                prob_obj['status'] = "processing"
                for submission in submissions:
                    if submission.status == "PASS":
                        prob_obj['status'] = "complete"
                        break

            field_list = [field_relation.field.field for field_relation in prob.field_relations]

            prob_obj["field"] = field_list
            problem_list.append(prob_obj)

        response_data = {
            "status": "success",
            "message": "Problem List Info",
            "data": problem_list,
            "user": user.to_json(),
            "size": size,
            "page_size": PAGE_SIZE
        }

        return Response(response_data)

    def post(self, request):
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        user = User.objects.get(id=request.user.id)
        page = request.GET.get('page', 1)
        page = int(page)
        keyword = request.GET.get('q', "")
        PAGE_SIZE=5
        
        # Load POST DATA
        body = json.loads(request.body.decode('utf-8'))
        filter_status = body.get("status", "all")
        filter_status = filter_status.upper()
        level = body.get("level", 0)
        level = int(level)
        field = body.get("field", [])
        
        # Filtering status
        submissions = Submission.objects.filter(user=user.id)
        if filter_status in ["PASS", "FAIL"]:
            submissions = submissions.filter(status=filter_status)
        
        # Load problem_id within filtering status
        problem_id_list = submissions.values_list("problem__id", flat=True)
        
        
        problems = Problem.objects
        if keyword != "":
            problems = problems.filter(title__contains=keyword)
        problems = problems.order_by('id')
        
        # problems = Problem.objects.all().order_by('id')
        # Submission query optimize by using Prefetch
        submissions_prefetch = Prefetch(
            'submission_set',
            queryset=Submission.objects.filter(user=request.user.id),
            to_attr='submissions'
        )
        # ProblemFieldRelation query optimize by using Prefetch
        field_relations_prefetch = Prefetch(
            'problemfieldrelation_set',
            queryset=ProblemFieldRelation.objects.only('field__field'),
            to_attr='field_relations'
        )
        # Add submissions, field_relations attributes to problems
        problems = problems.prefetch_related(submissions_prefetch, field_relations_prefetch)
        if filter_status == "NONE": # Load not submit problems
            problems = problems.exclude(id__in=problem_id_list)
        else: # Load submit problems corresponding status
            problems = problems.filter(id__in=problem_id_list)

        # default response
        response_data = {
            "status": "success",
            "message": "Problem Filter List",
            "data": [],
            "user": user.to_json()
        }    
        if len(problems) == 0:
            return Response(response_data)

        if level != 0: # filtering level
            problems = problems.filter(level=level)
        if len(field) != 0: # filtering field
            filtered_field_problems = ProblemFieldRelation.objects.filter(field_id__in=field).values_list('problem__id', flat=True)
            problems = problems.filter(id__in=filtered_field_problems)
        size = len(problems)
        if len(problems) < PAGE_SIZE:
            problems = problems[:]
        if len(problems) < PAGE_SIZE * page :
            problems = problems[PAGE_SIZE * (page - 1):]
        else:
            problems = problems[PAGE_SIZE * (page - 1):PAGE_SIZE * (page)]

        problem_list = []
        for prob in problems:
            prob_obj = {}
            prob_obj["id"] = prob.id
            prob_obj["title"] = prob.title
            prob_obj["level"] = prob.level

            submissions = prob.submissions

            if len(submissions) == 0:
                prob_obj['status'] = "uncomplete"
            else:
                prob_obj['status'] = "processing"
                for submission in submissions:
                    if submission.status == "PASS":
                        prob_obj['status'] = "complete"
                        break

            field_list = [field_relation.field.field for field_relation in prob.field_relations]

            prob_obj["field"] = field_list
            problem_list.append(prob_obj)

        response_data = {
            "status": "success",
            "message": "Problem List Info",
            "data": problem_list,
            "user": user.to_json(),
            "size": size,
            "page_size": PAGE_SIZE
        }

        return Response(response_data)


class ProblemFieldListView(APIView):
    """ Problem List View
    url        : problems/v1/fields/list/
    Returns :
        GET     : algorithm_field
    """
    def get(self, request):
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        user = User.objects.get(id=request.user.id)

        fields = AlgorithmField.objects.order_by('id')
        
        fields_list = []
        for field in fields:
            fields_list.append({"value":field.id, "label":field.field})

        response_data = {
            "status": "success",
            "message": "Problem Fields List Info",
            "data": fields_list,
            "user": user.to_json()
        }

        return Response(response_data)


class ProblemSaveView(APIView):
    """ Problem Save View
    url        : problems/v1/create/
    Returns :
        POST     : id
    """
    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        user = User.objects.get(id=request.user.id)
        # POST 데이터 가져오기
        body = json.loads(request.body.decode('utf-8'))
        title = body.get("title", "")
        level = body.get("level", 0)
        level = int(level)
        fields = body.get("field", [])
        description = body.get("description", "")
        testcases = body.get("tc", [{"testcase":"", "result":"", "is_sample":True}])
        if title == "" :
            return Response(get_fail_res("제목을 입력하지 않았습니다."))
        if description == "":
            return Response(get_fail_res("문제 설명을 입력하지 않았습니다."))
        if level <= 0:
            return Response(get_fail_res("난이도 설정에 오류가 있습니다."))
        if testcases[0]["result"] == "":
            return Response(get_fail_res("테스트케이스 결과를 입력하지 않았습니다."))
        try:
            with transaction.atomic():
                # 문제 생성
                problem = Problem.objects.create(title=title, level=level, description=description)

                # 문제 분야 연결 생성
                for field_id in fields:
                    ProblemFieldRelation.objects.create(field_id=field_id, problem_id=problem.id)

                # 문제 테스트케이스 생성
                for tc in testcases:
                    Testcase.objects.create(
                        problem_id=problem.id,  
                        testcase=tc["testcase"],
                        result=tc["result"],
                        is_sample=tc["is_sample"]
                    )

        except DatabaseError as error:
            logging.error(f'[ProblemSaveView] DatabaseError {error}')
            return Response(get_fail_res("문제 저장 중 DB에 오류가 발생했습니다."))
        except Exception as exception:
            logging.exception(f'[ProblemSaveView] Exception {exception}')
            return Response(get_fail_res("문제 저장 중 문제가 발생했습니다."))
        response_data = {
            "status": "success",
            "message": "문제를 저장했습니다. 홈으로 돌아갑니다.",
            "data": problem.to_json(),
            "user": user.to_json()
        }

        return Response(response_data)

class ProblemRecommendView(APIView):
    """ Problem List View
    url        : users/v1/problems/guideline/
    Returns :
        GET     : id, problem_title, algorithm_field, level
    """
    def get(self, request):
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        user = User.objects.get(id=request.user.id)
        page = request.GET.get('page', 1)
        page = int(page)
        PAGE_SIZE = 5

        # Problem 모델에서 페이지에 맞춰 가져온다.
        recommends = ProblemRecommend.objects.filter(user_id=request.user.id)[:PAGE_SIZE]

        problem_list = []
        for recommend in recommends:
            prob_obj = {}
            prob_obj["id"] = recommend.problem.id
            prob_obj["title"] = recommend.problem.title
            prob_obj["level"] = recommend.problem.level
            prob_obj['status'] = "ai"
            fields = ProblemFieldRelation.objects.filter(problem__id=recommend.problem.id).values_list("field__field")
            field_list = list(fields)
            prob_obj["field"] = field_list
            problem_list.append(prob_obj)
        response_data = {
            "status": "success",
            "message": "Problem List Info",
            "data": problem_list,
            "user": user.to_json()
        }

        return Response(response_data)

class ProblemSubmitView(APIView):
    """ 유저 코드 제출
    url        : problems/v1/<problem_id>/submit/
    Returns :
        POST     : id, num_tc, num_pass, exec_time, result
    """
    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        user_id = request.user.id
        
        user = User.objects.get(id=user_id)
        print("ProblemSubmitView")
        # url 파라미터 problem_id 저장
        problem_id = kwargs.get('problem_id')
        res = {"id":problem_id, "num_tc": 0, "num_pass":0, "exec_time":-1, "result":""}

        # json data 파싱하여 code와 language 저장
        body = json.loads(request.body.decode('utf-8'))
        code = body.get("code", "")
        lang = body.get("lang", "python")
        lang = lang.lower()
        lang = "cpp" if lang == "c++" else lang

        response = {"status": "success"}

        # 코드 안전성 체크
        is_safe = check_safe_code(code, lang)
        if not is_safe:
            res["result"] = "Violation"
            response["message"] = "위협 코드가 포함되어있습니다. 실행 거부되었습니다."
            response["data"] = res
            return Response(res)

        # 문제와 테스트케이스 조회
        try:
            problem = Problem.objects.get(id=problem_id)
            testcases = Testcase.objects.filter(problem=problem)
        except Exception as e:
            logging.exception(f"[ProblemSubmitView] {e}")
            res["result"] = "Not Found"
            return Response(get_fail_res("문제 정보를 찾을 수 없습니다."))

        num_testcase = len(testcases)
        res["num_tc"] = num_testcase

        # Execute Code
        for tc in testcases:
            exec_res = execution_code(code, lang, tc.testcase, tc.result)
            res["exec_time"] = exec_res["exec_time"]
            if exec_res["result"] == "PASS":
                res["num_pass"] += 1

        if res["num_pass"] == res["num_tc"]:
            res["result"] = "PASS"
        else:
            res["result"] = "FAIL"

        # Remove Unnecessary Files
        need_file = [".keep", "c.sh", "cpp.sh", "python.sh", "java.sh"]
        file_list = os.listdir(EXECUTE_DIR)
        for file_name in file_list:
            if file_name in need_file:
                continue
            file_path = os.path.join(EXECUTE_DIR, file_name)
            os.remove(file_path)

        # Create Submit History
        Submission.objects.create(
            problem = problem,
            lang = lang,
            status = res["result"],
            exec_time = res["exec_time"],
            user = user_id,
            num_pass = res["num_pass"],
            code = code
        )
        response = {
            "status": "success", 
            "message": f"{res['num_pass']}/{num_testcase}개의 테스트케이스를 통과했습니다.", 
            "data":res, 
            "user":user.to_json()
        }

        return Response(response)


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
    elif lang.lower() == "c" or lang.lower() == "cpp":
        is_safe = check_safe_c_cpp(code)
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

def check_safe_c_cpp(code):
    # 파이썬 코드에서 위협 패턴을 찾아 검증
    # threat_patterns: ChatGPT가 제안한 위협 패턴 목록  
    threat_patterns = [
            r'system\(.',  # system command
            r'chmod\(',  # Permission Change
            r'popen\(.',  # Communicate using pipe
            r'fopen\(',  # Malicious File Change
            r'exec\(',  # exec 함수 사용
            r'sprintf\(',  # Malicious String Overflow
            r'setuid\(',  # Change User Process UserID
        ]

    # 위협 패턴 확인
    for pattern in threat_patterns:
        if re.search(pattern, code):
            print(f"Find threat_patterns {pattern}")
            return False

    return True


# TODO: Make check_safe_java(code)


def execution_code(code, lang, testcase, answer):
    """ Receives the code, lang, and test case &
        Executes the code in a way that fits the lang to return the test case result.

    Args:
        code (str): 유저가 입력한 프로그래밍 코드
        lang (str): 유저가 선택한 프로그래밍 언어
        testcase (str): Testcase of Problem
        answer (str): Answer of Testcase

    Returns:
        result (dic): Result of Testcase & Execution Time
    """
    result = {}
    
    # Normalize answer
    answer = answer.replace('\r\n', '\n')
    
    # Case 1. python
    if lang == "python":
        # Make Code File & Connect Execution File
        create_new_file(code, ".py", testcase)

        # Find location of shell script
        script_name = os.path.join(EXECUTE_DIR, "python.sh")
        
        # Measure Execution start time and Execute .py
        start_time = time.time()
        re = subprocess.run(f'sh {script_name}', shell=True, capture_output=True, text=True, timeout=3)

    # Case 2. C
    elif lang == "c":
        # Make Code File & Connect Execution File
        create_new_file(code, ".c", testcase)
        
        # Find location of shell script
        script_name = os.path.join(EXECUTE_DIR, "c.sh")
        
        # Measure Execution start time and Execute .c
        start_time = time.time()
        re = subprocess.run(f'sh {script_name}', shell=True, capture_output=True, text=True, timeout=3)

    # Case 3. C++
    elif lang == "cpp":
        # Make Code File & Connect Execution File
        create_new_file(code, ".cc", testcase)
        
        # Find location of shell script
        script_name = os.path.join(EXECUTE_DIR, "cpp.sh")

        # Measure Execution start time and Execute .cc
        start_time = time.time()
        re = subprocess.run(f'sh {script_name}', shell=True, capture_output=True, text=True, timeout=3)

    # TODO: Incomplete Case 4. JAVA
    elif lang == "java":
        # Make Code File & Connect Execution File
        create_new_file(code, ".java", testcase)
        
        # Find location of shell script
        script_name = os.path.join(EXECUTE_DIR, "java.sh")
        
        # Measure Execution start time and Execute .c
        start_time = time.time()
        re = subprocess.run(f'sh {script_name}', shell=True, capture_output=True, text=True, timeout=3)

    # Measure Execution end time
    end_time = time.time()
    result["exec_time"] = end_time - start_time
        
    if re.returncode < 0:
        result["result"] = "Timeout"
    elif re.returncode > 0:
        result["result"] = "Error"  + re.stderr.strip()
    else:
        if re.stdout[:-1] == answer:
            result["result"] = "PASS"
        else:
            result["result"] = "FAIL"
        
    return result

def create_new_file(code, extension, testcase):        
    if not os.path.exists(EXECUTE_DIR):
        os.makedirs(EXECUTE_DIR, exist_ok=True)
    
    # Case Java, file name is Main
    if extension == ".java":
        file_path = os.path.join(EXECUTE_DIR, "Main"+extension)
        with open(file_path, "w") as file:
            file.write(code)
            
    # Other Case, file name is temp
    else:
        file_path = os.path.join(EXECUTE_DIR, "temp"+extension)
        with open(file_path, "w") as file:
            file.write(code)
    
        
    test_file_path = os.path.join(EXECUTE_DIR, "testcase.txt")
    with open(test_file_path, "w") as file:
        file.write(testcase)

