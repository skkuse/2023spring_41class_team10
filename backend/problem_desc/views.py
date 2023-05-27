from rest_framework.response import Response
from rest_framework.views import APIView
from backend.settings import BASE_DIR

import json
import os

from problem_desc.models import *
# from users.models import User

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
        try:
            relation = ProblemFieldRelation.objects.get(problem = target_problem)
        except ProblemFieldRelation.DoesNotExist:
            return Response(get_fail_res("Description Failed!: Don't Exist ProblemFieldRelation!"))
        target_field = relation.field

        # Check whether the Testcase exists
        try:
            target_tc = Testcase.objects.get(problem = target_problem)
        except Testcase.DoesNotExist:
            return Response(get_fail_res("Description Failed!: Don't Exist Testcase!"))
        sample_tc = ""
        if target_tc.is_sample:
            sample_tc = target_tc.testcase
        
        response_data = {
            "id" : target_problem.id,
            "title" : target_problem.title,
            "field" : target_field.field,
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
        tc_user = body.get("tc_user", "")
        
        # Check whether the problem exists
        try:
            target_problem = Problem.objects.get(id=id)
        except Problem.DoesNotExist:
            return Response(get_fail_res("Save Failed!: Don't Exist Problem!"))
        
        if language == "python":
            # Create a new Python file
            self.create_new_file(code, ".py")
            
            # Get result by using Subprocess
            start_time = time.time()
            result = subprocess.run(['python3', self.file_path, tc_user], capture_output=True, text=True, timeout=3)
            end_time = time.time()
            output = result.stdout
        elif language == "C":
            # Create a new C file
            self.create_new_file(code, ".c")
            
            # Compile first before Execution
            subprocess.run(['gcc', self.file_path, '-o', 'out'])
            
            # Get result by using Subprocess
            start_time = time.time()
            result = subprocess.run(['./out', tc_user], capture_output=True, text=True, timeout=3)
            end_time = time.time()
            output = result.stdout
        elif language == "C++":
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
            file_path = os.path.join(self.dir_path, file_name)
            os.remove(file_path)
        
        
        
        # When execution fail due to timeout, return Fail Response
        if result.returncode != 0:
            # Fail Case, Create Table
            Execution.objects.create(
            problem = target_problem,
            lang = language,
            status = "Fail",
            exec_time = execution_time,
            user = request.user.id,
            result = output
            )
            return Response(get_fail_res("Execution Failed: Timeout!"))
        
        # Success Case, Create Table
        Execution.objects.create(
            problem = target_problem,
            lang = language,
            status = "Success",
            exec_time = execution_time,
            user = request.user.id,
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
        self.dir_path = os.path.join(BASE_DIR, "/problem_desc/temp_file_dir")
        file_path = os.path.join(self.dir_path+"/temp"+extension)
        with open(file_path, "w") as file:
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
        
        history = UserCodeHistory.objects.filter(user = request.user.id, problem = target_problem)
        if history.exists():
            user_history = history.first()
            user_history.version += 1
            user_history.code = user_code
            user_history.save()
        else:
            UserCodeHistory.objects.create(
                user = request.user.id,
                problem = target_problem,
                version = 1,
                code = user_code,
                memo = ""
            )
        
        message = ""
        
        response_data = {
            "id" : id,
            "message" : message
        }
        
        return Response(response_data)