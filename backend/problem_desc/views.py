from rest_framework.response import Response
from rest_framework.views import APIView
from backend.settings import BASE_DIR

import json
import os

from problem_desc.models import Problem, Testcase, UserCodeHistory
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
    
    def get(self, request):
        
        response_data = {
            
        }
        
        return Response(response_data)


class ProblemExecView(APIView):
    
    def post(self, request, id):
        
        body = json.loads(request.body.decode('utf-8'))
        
        code = body.get("code", "")
        language = body.get("lang", "python")
        tc_user = body.get("tc_user", "")
        
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
        
        
        # Remove Execution files
        file_list = os.listdir(self.dir_path)
        for file_name in file_list:
            file_path = os.path.join(self.dir_path, file_name)
            os.remove(file_path)
        
        # When execution fail due to timeout, return Fail Response
        if result.returncode != 0:
            return Response(get_fail_res("Execution Failed: Timeout"))
        
        # Execution Success
        response_data = {
            "id" : id,
            "result" : output,
            "exec_time" : end_time-start_time
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
        
        UserCodeHistory.objects.create(
            problem = id,
            version=1,
            code = user_code,
            memo = ""
        )
        
        message = ""
        
        response_data = {
            "id" : id,
            "message" : message
        }
        
        return Response(response_data)