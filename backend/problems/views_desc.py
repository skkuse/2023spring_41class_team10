from rest_framework.response import Response
from rest_framework.views import APIView
from backend.settings import BASE_DIR

import json
import os

from problems.models import *

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
        
        # Check whether the problem exists
        try:
            target_problem = Problem.objects.get(id=id)
        except Problem.DoesNotExist:
            return Response(get_fail_res("Description Failed!: Don't Exist Problem!"))
        
        # Check whether the relation exists
        relations = ProblemFieldRelation.objects.filter(problem = target_problem)
        target_field = []
        
        if relations.exists():
            for i in range(relations.count()):
                field_obj = relations[i].field
                target_field.append(field_obj.field)
        else:
            return Response(get_fail_res("Description Failed!: Don't Exist ProblemFieldRelation!"))

        # Check whether the Testcase exists
        target_tc = Testcase.objects.filter(problem = target_problem, is_sample = True)
        sample_tc = []
        
        if target_tc.exists():
            sample_tc = [tc.testcase for tc in target_tc]
        else:
            return Response(get_fail_res("Description Failed!: Don't Exist Testcase!"))
        
        response_data = {
            "id" : target_problem.id,
            "title" : target_problem.title,
            "field" : target_field,
            "level" : target_problem.level,
            "description" : target_problem.description,
            "tc_sample" : sample_tc
        }
        
        return Response(response_data)


class ProblemExecView(APIView):
    
    def post(self, request, id):
        
        body = json.loads(request.body.decode('utf-8'))
        
        code = body.get("code", "")
        language = body.get("lang", "python")
        language = language.lower()
        tc_user = body.get("tc_user", "")
        
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
        file_list = os.listdir(self.dir_path)
        for file_name in file_list:
            if file_name == ".keep":
                continue
            file_path = os.path.join(self.dir_path, file_name)
            os.remove(file_path)
        
        # When execution fail due to timeout, return Error Response
        if result.returncode < 0:
            # Timeout Case, Create Table
            Execution.objects.create(
                problem = target_problem,
                lang = language,
                status = "Timeout",
                exec_time = execution_time,
                user = 1,
                # user = request.user.id,
                result = output
            )
            return Response(get_fail_res("Execution Failed: Timeout!"))        
        
        # Error Case, Create Table
        if result.returncode > 0:
            Execution.objects.create(
                problem = target_problem,
                lang = language,
                status = "Error",
                exec_time = execution_time,
                user = 1,
                # user = request.user.id,
                result = result.stderr
            )
            return Response(get_fail_res("Execution Failed: Error!      " + result.stderr))
        
        # Success Case, Create Table
        Execution.objects.create(
            problem = target_problem,
            lang = language,
            status = "Success",
            exec_time = execution_time,
            user = 1,
            # user = request.user.id,
            result = output
        )
        
        # Execution Success
        response_data = {
            "id" : id,
            "result" : output,
            "exec_time" : execution_time
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
    
    def post(self, request, id):
        body = json.loads(request.body.decode('utf-8'))
        
        
        user_code = body.get("code", "")
        language = body.get("lang", "python")
        tc_user = body.get("tc_user", "")
        
        # Check whether the problem exists
        try:
            target_problem = Problem.objects.get(id=id)
        except Problem.DoesNotExist:
            return Response(get_fail_res("Save Failed!: Don't Exist Problem!"))
        
        # "user = 1" is just for test
        history = UserCodeHistory.objects.filter(user = 1, problem = target_problem)
        if history.exists():
            user_history = history.last()
            UserCodeHistory.objects.create(
                user = 1,
                # user = request.user.id,
                problem = target_problem,
                version = user_history.version + 1,
                code = user_code,
                memo = ""
            )
            message = "Save time: " + str(user_history.version+1)
        else:
            UserCodeHistory.objects.create(
                user = 1,
                # user = request.user.id,
                problem = target_problem,
                version = 1,
                code = user_code,
                memo = ""
            )
            message = "First Save"
                
        response_data = {
            "id" : id,
            "message" : message
        }
        
        return Response(response_data)