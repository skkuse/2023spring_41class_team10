from apscheduler.schedulers.background import BackgroundScheduler
import django.db

from users.models import User
from lectures.models import Lecture, LectureComment
from backend.settings import YOUTUBE_API_KEY, GITHUB_TOKEN, OPENAI_API_KEY

from urllib.parse import urlparse, parse_qs
from datetime import datetime
import requests
import re
import logging
import openai
import json

def start():
    scheduler=BackgroundScheduler(timezone='Asia/Seoul')
    @scheduler.scheduled_job('cron', minute="*/30", misfire_grace_time=60, id='yt_scheduler')
    def scheduler_job():
        print('yt_scheduler start', datetime.now())
        try:
            LIMIT = 2
            api_url = "https://www.googleapis.com/youtube/v3/commentThreads"
            params = {
                "part": "snippet",
                "videoId": None, #파싱하여 넣기
                "maxResults": 5,
                "order": "relevance",  # 인기순
                "key": YOUTUBE_API_KEY,
            }
            lectures = Lecture.objects.filter(memo="").order_by("id")[:LIMIT]
            for lecture in lectures:
                # video_id 파싱
                url = lecture.video_link
                video_id = get_video_id(url)
                params["videoId"] = video_id
                response = requests.get(api_url, params=params)

                # 유튜브 댓글 받아서 정제하여 저장
                res_json = response.json()
                items = res_json["items"]
                comment_list = []
                for item in items:
                    snippet = item["snippet"]["topLevelComment"]["snippet"]
                    comment = snippet["textOriginal"]
                    comment = de_emoji(comment)
                    comment_list.append(comment)
                    LectureComment.objects.create(lecture=lecture, comment=comment)

                gpt_memo = get_lecture_memo(comment_list)
                lecture.memo = gpt_memo
                lecture.save()
        except Exception as e:
            logging.exception(f"yt_scheduler exception: {e}")
            django.db.close_old_connections()

    scheduler.start()

# 유튜브 링크에서 video id 파싱
def get_video_id(url):
    url_data = urlparse(url)
    query = parse_qs(url_data.query)
    video_id = query.get("v", None)
    return video_id

# 유튜브 댓글에 많이 보이는 이모지 제거
def de_emoji(text):
    de_emoji_text = text
    emoji_pattern = re.compile("["u"\U00010000-\U0010FFFF""]+", flags=re.UNICODE)
    if type(text) == str:
        de_emoji_text = emoji_pattern.sub(r'', text)
    return de_emoji_text

# 유튜브 댓글을 이용한 유튜브 영상 한줄평
def get_lecture_memo(comment_list):
    print("get_lecture_memo")
    chat_role = "assistant"
    content = "COMMENTS는 어떤 유튜브 영상의 댓글이다. 이 댓글만 보고 유튜브 영상의 장점을 짧은 한 줄의 한글로 요약해라. 이는 흥미 요소이므로 정확성을 크게 신경쓰지 않아도 된다.\n예시1: [Javascript] 자세한 설명이 실력향상에 도움이 됩니다.\n예시2: [C언어] 재치있는 설명으로 밤새도록 볼 수 있습니다.\nCOMMENTS:\n"
    req_comments = "\n".join(comment_list)

    openai.api_key = OPENAI_API_KEY
    openai.Model.list()

    chat_messages = [{"role": chat_role, "content": content+req_comments}]
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=chat_messages,
        max_tokens=50
    )
    answer = completion.choices[0].message['content']
    print("answer", answer)
    # (휴리스틱) "장점:" 을 붙이는 경우 분리
    p_answer= answer.split('장점:')[-1]

    return p_answer
