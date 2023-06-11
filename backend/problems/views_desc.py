from rest_framework.response import Response
from rest_framework.views import APIView
from backend.settings import BASE_DIR

import json
import os

from problems.models import *
from users.models import User
from backend.settings import EXECUTE_DIR

import subprocess   # For execution user's code
import time         # For measure execution time

def get_fail_res(msg):
    """ 
    Create fail Response
    """
    return {
        'status': "fail",
        'message': msg
    }


class ProblemDescView(APIView):
    
    def get(self, request, id):
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        user = User.objects.get(id=request.user.id)
        # Check whether the problem exists
        try:
            target_problem = Problem.objects.get(id=id)
        except Problem.DoesNotExist:
            return Response(get_fail_res("Description Failed!: Don't Exist Problem!"))
        
        # 알고리즘 분야 리스트 가져오기
        fields = ProblemFieldRelation.objects.filter(problem=target_problem).values_list("field__field", flat=True)
        target_field = list(fields)
        print("target_field", target_field)

        # Check whether the Testcase exists
        target_tc = Testcase.objects.filter(problem=target_problem, is_sample=True)
        sample_tc = []
        for tc in target_tc:
            sample_tc.append({"testcase" : tc.testcase, "result" : tc.result})

        if request.user.is_authenticated:
            user_submissions = Submission.objects.filter(user=request.user.id, problem_id=id)
            if len(user_submissions) == 0:
                status = "uncomplete"
            else:
                pass_submissions = user_submissions.filter(status="PASS")
                if len(pass_submissions) == 0:
                    status = "processing"
                else:
                    status = "complete"
            print(user_submissions)
        else:
            status = "uncomplete"

        data = {
            "id" : target_problem.id,
            "title" : target_problem.title,
            "field" : target_field,
            "level" : target_problem.level,
            "description" : target_problem.description,
            "tc_sample" : sample_tc,
            "status" : status
        }
        response_data = {
            "status" : "success",
            "message" : f"문제 {target_problem.id}번 데이터입니다.",
            "data" : data,
            "user" : user.to_json()
        }

        print("response_data", response_data)
        return Response(response_data)


class ProblemExecView(APIView):
    """코드 실행

    url        : problems/v1/<id>/exec/
    Returns :
        POST   : status, message, id
    """

    def post(self, request, id):
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        user_id = request.user.id
        user = User.objects.get(id=user_id)
        body = json.loads(request.body.decode('utf-8'))
        code = body.get("code", "")
        language = body.get("lang", "python")
        language = language.lower()
        language = "cpp" if language == "c++" else language
        tc_user = body.get("tc_user", "")
        print("tc_user", tc_user)

        # 코드 공백 검사
        if code.strip() == "":
            return Response(get_fail_res("코드를 입력하지 않았습니다."))

        # Check whether the problem exists
        try:
            target_problem = Problem.objects.get(id=id)
        except Problem.DoesNotExist:
            return Response(get_fail_res("Exececution Failed!: Don't Exist Problem!"))

        # Check testcase user & Execute Code
        exec_res = dict()
        if tc_user == "":
            msg=f"Execution Nothing: User's testcase does not exist!"
        else:
            exec_res = execution_code(code, language, tc_user)

        # Remove Execution files
        need_file = [".keep", "c.sh", "cpp.sh", "java.sh", "python.sh"]
        file_list = os.listdir(EXECUTE_DIR)
        for file_name in file_list:
            if file_name not in need_file:
                file_path = os.path.join(EXECUTE_DIR, file_name)
                os.remove(file_path)

        # When execution fail due to timeout, return Error Response
        if exec_res["status"] == "Timeout":
            execution = Execution.objects.create(
                problem = target_problem,
                lang = language,
                status = "Timeout",
                exec_time = exec_res["exec_time"],
                user = user_id,
                result = exec_res["result"]
            )
            msg=f"Execution Failed: Timeout!"
        # Error Case, Create Table
        elif exec_res["status"][0:5] == "Error":
            execution = Execution.objects.create(
                problem = target_problem,
                lang = language,
                status = "Error",
                exec_time = exec_res["exec_time"],
                user = user_id,
                result = exec_res["result"]
            )
            error_msg=exec_res["status"][6:]
            msg=f"Execution Failed: Error! {error_msg}"
        else:
            # Success Case, Create Table
            execution = Execution.objects.create(
                problem = target_problem,
                lang = language,
                status = "Success",
                exec_time = exec_res["exec_time"],
                user = user_id,
                result = exec_res["result"]
            )
            msg="실행에 성공했습니다. 결과를 확인해주세요."

        data = {
            "id":target_problem.id, 
            "result":execution.result, 
            "exec_time": execution.exec_time, 
            "status": execution.status
        }
        response_data = {
            "status" : "success", 
            "message" : msg, 
            "data" : data,
            "user" : user.to_json()
        }

        return Response(response_data)


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

def execution_code(code, lang, testcase):
    """ Receives the code, lang, and test case &
        Executes the code in a way that fits the lang to return the test case result.

    Args:
        code (str): 유저가 입력한 프로그래밍 코드
        lang (str): 유저가 선택한 프로그래밍 언어
        testcase (str): Testcase of Problem

    Returns:
        result (dic): Result of Testcase & Execution Time & Status
    """
    result = {"result": "", "exec_time": -1, "status": ""}
        
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
        result["status"] = "Timeout"
    elif re.returncode > 0:
        result["status"] = "Error" + re.stderr.strip()
    else:
        result["status"] = "Success"
        result["result"] = re.stdout
        
    return result

class ProblemCodeSaveView(APIView):
    """ 유저가 문제 풀이코드를 임시저장

    url        : problems/v1/<id>/save/
    Returns :
        POST   : status, message, id
    """

    def post(self, request, id):
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        user_id = request.user.id
        user = User.objects.get(id=user_id)
        body = json.loads(request.body.decode('utf-8'))
        user_code = body.get("code", "")
        language = body.get("lang", "python")

        # Check whether the problem exists
        try:
            target_problem = Problem.objects.get(id=id)
        except Problem.DoesNotExist:
            return Response(get_fail_res("Save Failed!: Don't Exist Problem!"))

        history = UserCodeHistory.objects.filter(user=user_id, problem=target_problem).order_by("-id")
        if history.exists():
            user_history = history.first()
            UserCodeHistory.objects.create(
                user = user_id,
                problem = target_problem,
                version = user_history.version + 1,
                code = user_code,
                memo = "",
                lang = language
            )
            message = f"버전 {str(user_history.version+1)}가 저장되었습니다."
        else:
            UserCodeHistory.objects.create(
                user = user_id,
                problem = target_problem,
                version = 1,
                code = user_code,
                memo = "",
                lang = language
            )
            message = "저장되었습니다."

        response_data = {
            "id" : id,
            "status" : "success",
            "message" : message,
            "user": user.to_json()
        }
        
        return Response(response_data)

class ProblemCodeLoadView(APIView) :
    """저장 코드 불러오기

    url        : problems/v1/<id>/load/
    Returns :
        GET   : status, message, id
    """
    def get(self, request, id):
        if not request.user.is_authenticated:
            return Response(get_fail_res("user is not authenticated"))
        user_id = request.user.id
        user = User.objects.get(id=user_id)

        # Check whether the problem exists
        try:
            target_problem = Problem.objects.get(id=id)
        except Problem.DoesNotExist:
            return Response(get_fail_res("Save Failed!: Don't Exist Problem!"))

        try:
            history = UserCodeHistory.objects.filter(user=user_id, problem=target_problem).order_by("-id").first()
            data = {
                "id": history.problem.id,
                "code": history.code,
                "lang": history.lang
            }
            create_date = str(history.create_at)[:19]
            message = f"{create_date}에 저장된 코드를 불러왔습니다.(버전 {history.version})"
        except Exception as e:
            message = "저장된 코드가 없습니다."
            print(message, e)
            data = {
                "id": id,
                "code": "",
                "lang": ""
            }

        response_data = {
            "id" : id,
            "message" : message,
            "status" : "success",
            "data" : data,
            "user" : user.to_json()
        }

        return Response(response_data)
