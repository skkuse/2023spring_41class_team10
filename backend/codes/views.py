from django.http import JsonResponse
from rest_framework.views import APIView

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

        parsed_text = parse_code(answer)
        print("parsed_text", parsed_text)

        return JsonResponse({"status": "success", "message": parsed_text["text"], "code": parsed_text["code"], 'raw': answer})
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

    split_text = text.split("```")
    if len(split_text) >= 3:
        # 3개 이상이면 코드 포함
        # TODO 만약 코드를 2가지 이상 제안해 줄 경우 처리
        parsed_text["text"] = split_text[0] + "\n" +split_text[2]
        parsed_text["code"] = split_text[1]
        
        # 마크다운에 언어 포함인지 확인
        lang_index = split_text[1].find("\n")
        if lang_index != -1:
            lang = split_text[1][:lang_index]
            parsed_text["code"] = split_text[1][lang_index+1:]
            parsed_text["language"] = lang.strip()
    else:
        parsed_text["text"] = text
    
    # 공백이 너무 긴 경우 방지
    parsed_text["text"] = re.sub(r'\n\s*\n+', '\n\n', parsed_text["text"])
    
    return parsed_text
