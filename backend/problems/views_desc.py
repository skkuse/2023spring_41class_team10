from rest_framework.response import Response
from rest_framework.views import APIView
from backend.settings import BASE_DIR

import json
import os

from problems.models import *
from users.models import User

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
            "user" : user
        }
        user
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

        if language == "python":
            # Create a new Python file
            self.create_new_file(code, ".py")
            
            # Get result by using Subprocess
            start_time = time.time()
            result = subprocess.run(['python3', self.file_path, tc_user], capture_output=True, text=True, timeout=3)
            end_time = time.time()
            output = result.stdout
        elif language == "c":
            # Create a new C file
            self.create_new_file(code, ".c")
            
            # Compile first before Execution
            subprocess.run(['gcc', self.file_path, '-o', 'out'])
            
            # Get result by using Subprocess
            start_time = time.time()
            result = subprocess.run(['./out', tc_user], capture_output=True, text=True, timeout=3)
            end_time = time.time()
            output = result.stdout
        elif language == "cpp":
            # Create a new C++ file
            self.create_new_file(code, ".cc")
            
            # Compile first before Execution
            subprocess.run(['g++', self.file_path, '-o', 'out'])
            
            # Get result by using Subprocess
            start_time = time.time()
            result = subprocess.run(['./out', tc_user], capture_output=True, text=True, timeout=3)
            end_time = time.time()
            output = result.stdout

        execution_time = end_time-start_time

        # Remove Execution files
        need_file = [".keep", "c.sh", "cpp.sh", "java.sh", "python.sh"]
        file_list = os.listdir(self.dir_path)
        for file_name in file_list:
            if file_name not in need_file:
                file_path = os.path.join(self.dir_path, file_name)
                os.remove(file_path)

        # When execution fail due to timeout, return Error Response
        if result.returncode < 0:
            execution = Execution.objects.create(
                problem = target_problem,
                lang = language,
                status = "Timeout",
                exec_time = execution_time,
                user = user_id,
                result = output
            )
            msg=f"Execution Failed: Timeout!"
        # Error Case, Create Table
        elif result.returncode > 0:
            execution = Execution.objects.create(
                problem = target_problem,
                lang = language,
                status = "Error",
                exec_time = execution_time,
                user = user_id,
                result = result.stderr
            )
            msg=f"Execution Failed: Error! {result.stderr}"
        else:
            # Success Case, Create Table
            execution = Execution.objects.create(
                problem = target_problem,
                lang = language,
                status = "Success",
                exec_time = execution_time,
                user = user_id,
                result = output
            )
            msg="Execution Success!"

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
            "user" : user
        }

        return Response(response_data)

    def create_new_file(self, code, extension):
        self.dir_path = os.path.join(BASE_DIR, "problems/temp_file_dir")
        
        if not os.path.exists(self.dir_path):
            os.makedirs(self.dir_path, exist_ok=True)
        
        self.file_path = os.path.join(self.dir_path, "temp"+extension)
        with open(self.file_path, "w") as file:
            file.write(code)


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
            "user": user
        }
        
        return Response(response_data)

class ProblemCodeLoadView(APIView) :
    """저장 코드 불러오기

    url        : problems/v1/<id>/load/
    Returns :
        POST   : status, message, id
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
            "user" : user
        }

        return Response(response_data)
