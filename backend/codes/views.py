from django.http import JsonResponse
from rest_framework.views import APIView
from codes.models import Review, Comment, Deadcode, Refactor

import os
import json
import openai
import re

from backend.settings import OPENAI_API_KEY, DATA_DIR

chat_role = "assistant"


class ChatRefactorAPIView(APIView):
    suffix = "\n코드를 보고 친근한 말투로 리팩토링 코드를 제안해주세요."
    meta_messages = []

    def post(self, request, *args, **kwargs):
        print("ChatGPTSendView")
        self.init_chat()
        chat_messages = self.meta_messages
        openai.api_key = OPENAI_API_KEY
        openai.Model.list()
        body = json.loads(request.body.decode('utf-8'))
        
        role = body.get("role", "user")
        problem = body.get("problem", "")
        code = body.get("code", "")
        lang = body.get("lang", "")
        submission_id = body.get("submission_id", 0)
        # 사용언어와, 문제설명, 코드를 모두 GPT에게 질의
        content = f"""사용자가 문제를 보고 {lang} 코드를 작성했습니다.\n주어진 문제\n{problem}\n코드\n{code}\n"""

        chat_messages.append({"role": role, "content": content+self.suffix})
        print("before message", chat_messages)
        print("before api call", role, content)

        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=chat_messages,
            max_tokens=1024
        )
        
        answer = completion.choices[0].message['content']
        print("answer", answer)
        chat_messages.append({"role": chat_role, "content": answer})

        parsed_text, is_no_split = parse_code(answer)
        print("parsed_text", parsed_text)

        # 요청 기록 DB 저장
        if is_no_split:
            # 코드 제안없이 리뷰 메시지만 전송
            Refactor.objects.create(code="", message=answer, target_id=submission_id)
            return JsonResponse({"status": "success", "message": answer, "code": ""})
        else:
            Refactor.objects.create(code=parsed_text["code"], message=parsed_text["text"], target_id=submission_id)
            return JsonResponse({"status": "success", "message": parsed_text["text"], "code": parsed_text["code"]})
    def init_chat(self):
        print("init")
        template_name = "refactor.json"
        with open(os.path.join(DATA_DIR, template_name), "r") as f:
            self.meta_messages=json.load(f)

def parse_code(text):
    """
    마크다운 문법에서 코드를 감싸는 ```를 이용해 코드와 일반 텍스트를 분리하는 parser 함수
    """ 

    parsed_text = {"code": "", "text":""}
    is_no_split = False
    split_text = text.split("```")
    if len(split_text) >= 3:
        # 3개 이상이면 코드 포함
        for i, split_txt in enumerate(split_text):
            if i % 2 == 0:
                parsed_text["text"] += split_txt
                parsed_text["text"] += "\n"
            else:
                parsed_text["code"] += split_txt
                parsed_text["code"] += "\n"
        
        # 마크다운에 언어 포함인지 확인
        lang_index = split_text[1].find("\n")
        if lang_index != -1:
            lang = split_text[1][:lang_index]
            parsed_text["code"] = split_text[1][lang_index+1:]
            parsed_text["language"] = lang.strip()
    else:
        parsed_text["text"] = text
        is_no_split = True
    
    # 공백이 너무 긴 경우 방지
    parsed_text["text"] = re.sub(r'\n\s*\n+', '\n\n', parsed_text["text"])
    
    return parsed_text, is_no_split

#Review
class ChatReviewAPIView(APIView):
    suffix = "\n 친절한 말투로 해당 코드에서 사용한 알고리즘이 문제를 해결하는 데 적합했는 지를 판단하여 알려주세요. 그리고 주어진 코드의 흐름에 대한 설명과 시간복잡도를 알려주세요. 사용자가 문제를 해결하기 위해 사용한 알고리즘보다 더 효율적인 알고리즘이 있다면 추천해주세요. "
    meta_messages = []

    def post(self, request, *args, **kwargs):
        self.init_chat()
        chat_messages = self.meta_messages
        openai.api_key = OPENAI_API_KEY
        openai.Model.list()
        body = json.loads(request.body.decode('utf-8'))
        
        role = body.get("role", "user")
        problem = body.get("problem", "")
        code = body.get("code", "")
        lang = body.get("lang", "")
        submission_id = body.get("submission_id", 0)

        content = f"""사용자가 문제를 보고 {lang} 코드를 작성했습니다.\n주어진 문제\n{problem}\n코드\n{code}\n"""

        chat_messages.append({"role": role, "content": content+self.suffix})

        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=chat_messages,
            max_tokens=1024
        )
        
        answer = completion.choices[0].message['content']
        chat_messages.append({"role": chat_role, "content": answer})
        parsed_text, is_no_split = parse_code(answer)
        if is_no_split:
            # 코드 제안없이 리뷰 메시지만 전송
            Review.objects.create(code="", message=answer, target_id=submission_id)
            return JsonResponse({"status": "success", "message": answer, "code": ""})
        else:
            Review.objects.create(code=parsed_text["code"], message=parsed_text["text"], target_id=submission_id)
            return JsonResponse({"status": "success", "message": parsed_text["text"], "code": parsed_text["code"]})

    def init_chat(self):
        print("init")
        template_name = "review.json"
        with open(os.path.join(DATA_DIR, template_name), "r") as f:
            self.meta_messages=json.load(f)

#Comment
class ChatAddCommentAPIView(APIView):
    suffix = "\n reader의 코드 이해를 돕기 위해, 주어진 코드에 함수(method)나 class, 반복문, 조건문, 변수, 배열에 대한 주석을 추가해주세요."
    meta_messages = []

    def post(self, request, *args, **kwargs):
        self.init_chat()
        chat_messages = self.meta_messages
        openai.api_key = OPENAI_API_KEY
        openai.Model.list()
        body = json.loads(request.body.decode('utf-8'))

        role = body.get("role", "user")
        problem = body.get("problem", "")
        code = body.get("code", "")
        lang = body.get("lang", "")
        submission_id = body.get("submission_id", 0)

        content = f"""사용자가 문제를 보고 {lang} 코드를 작성했습니다.\n주어진 문제\n{problem}\n코드\n{code}\n"""

        chat_messages.append({"role": role, "content": content+self.suffix})

        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=chat_messages,
            max_tokens=1024
        )
        
        answer = completion.choices[0].message['content']
        chat_messages.append({"role": chat_role, "content": answer})
        
        parsed_text, is_no_split = parse_code(answer)
        if is_no_split:
            Comment.objects.create(code=answer, message="", target_id=submission_id)
            return JsonResponse({"status": "success", "message": "", "code": answer})
        else:
            Comment.objects.create(code=parsed_text["code"], message=parsed_text["text"], target_id=submission_id)
            return JsonResponse({"status": "success", "message": parsed_text["text"], "code": parsed_text["code"]})


    def init_chat(self):
        template_name = "comment.json"
        with open(os.path.join(DATA_DIR, template_name), "r") as f:
            self.meta_messages=json.load(f)

#Deadcode
class ChatDeadcodeAPIView(APIView):
    suffix = "\n 주어진 코드를 보고 코드가 정상적으로 작동하는 데에 불필요한 코드를 삭제해주세요."
    meta_messages = []

    def post(self, request, *args, **kwargs):
        self.init_chat()
        chat_messages = self.meta_messages
        openai.api_key = OPENAI_API_KEY
        openai.Model.list()
        body = json.loads(request.body.decode('utf-8'))
        
        role = body.get("role", "user")
        problem = body.get("problem", "")
        code = body.get("code", "")
        lang = body.get("lang", "")
        submission_id = body.get("submission_id", 0)
        
        content = f"""사용자가 문제를 보고 {lang} 코드를 작성했습니다.\n주어진 문제\n{problem}\n코드\n{code}\n"""

        chat_messages.append({"role": role, "content": content+self.suffix})

        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=chat_messages,
            max_tokens=1024
        )
        
        answer = completion.choices[0].message['content']
        chat_messages.append({"role": chat_role, "content": answer})
        
        parsed_text, is_no_split = parse_code(answer)
        if is_no_split:
            Deadcode.objects.create(code="", message=answer, target_id=submission_id)
            return JsonResponse({"status": "success", "message": answer, "code": ""})
        else:
            Deadcode.objects.create(code=parsed_text["code"], message=parsed_text["text"], target_id=submission_id)
            return JsonResponse({"status": "success", "message": parsed_text["text"], "code": parsed_text["code"]})

    def init_chat(self):
        print("init")
        template_name = "deadcode.json"
        with open(os.path.join(DATA_DIR, template_name), "r") as f:
            self.meta_messages=json.load(f)
