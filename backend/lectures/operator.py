from apscheduler.schedulers.background import BackgroundScheduler
import django.db

from users.models import User, UserGitHubRepository
from lectures.models import Lecture, LectureComment, LectureRecommend, LectureHistory, LectureFieldRelation
from backend.settings import YOUTUBE_API_KEY, GITHUB_TOKEN, OPENAI_API_KEY

from urllib.parse import urlparse, parse_qs
from datetime import datetime
from bs4 import BeautifulSoup

import requests
import re
import logging
import openai
import json
import time

def start():
    scheduler=BackgroundScheduler(timezone='Asia/Seoul')
    @scheduler.scheduled_job('cron', minute="12, 24, 36, 48", misfire_grace_time=60, id='yt_scheduler')
    def yt_scheduler_job():
        run_yt_scheduler_job()

    @scheduler.scheduled_job('cron', minute="*/20", misfire_grace_time=60, id='github_scheduler')
    def github_scheduler_job():
        user_ids = UserGitHubRepository.objects.values('user_id').distinct()
        users = User.objects.filter(is_superuser=False).exclude(id__in=user_ids).order_by("id")
        if len(users) > 0:
            target = users.first()
            print("target", target.github_username)
            run_github_scheduler_job(target.github_username)
        else:
            print("target: last updated")
            user_ids = UserGitHubRepository.objects.values('user_id').distinct().order_by("update_at")
            user_obj = user_ids.first()
            target = User.objects.get(id=user_obj["user_id"])
            print("target", target.github_username)
            run_github_scheduler_job(target.github_username)

    @scheduler.scheduled_job('cron', minute="0, 15, 30, 45", misfire_grace_time=60, id='recommend_scheduler')
    def recommend_lecture_scheduler_job():
        user_ids = LectureRecommend.objects.values('user_id').distinct()
        users = User.objects.filter(is_superuser=False).exclude(id__in=user_ids).order_by("id")
        if len(users) > 0:
            target = users.first()
            print("target", target.github_username)
            run_recommend_lecture_scheduler_job(target.id)
        else:
            print("target: last updated")
            user_ids = LectureRecommend.objects.values('user_id').distinct().order_by("update_at")
            user_obj = user_ids.first()
            # user_ids 출력
            print("user_ids", user_ids)
            target = User.objects.get(id=user_obj["user_id"])
            print("target", target.github_username)
            run_recommend_lecture_scheduler_job(target.id)
    scheduler.start()

def run_yt_scheduler_job():
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

def run_github_scheduler_job(username):
    
    github_user_url = f"https://github.com/{username}"
    github_api_url = "https://api.github.com/repos/"
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
    }

    # github user 페이지에서 기여내역 많은 리포 최대 3개 수집
    res = requests.get(github_user_url)
    if res.status_code == 200:
        soup = BeautifulSoup(res.text, 'html.parser')
        a_tags = soup.find_all('a')
        for tag in a_tags:
            repo = tag.find(class_='repo')
            owner = tag.find(class_='owner')
            if repo and owner: # 협업 리포지토리
                repo_name = f'{owner.text}/{repo.text}'
            elif repo: # 본인 리포지토리
                repo_name = f"{username}/{repo.text}"
            else:
                continue
            repo_name = re.sub(r'\n', '', repo_name)
            print("repo_name", repo_name)
            # GitHub API에서 리포지토리 정보 수집
            repo_res = requests.get(github_api_url + repo_name,headers=headers)
            res_json = repo_res.json()
            repo_objs = UserGitHubRepository.objects.filter(repo_name=repo_name, github_username=username)
            if len(repo_objs) > 0:
                user_repo = repo_objs.first()
                user_repo.lang=str(res_json["language"])
                user_repo.description=str(res_json["description"])
                user_repo.topics=json.dumps(res_json["topics"])
                user_repo.update_at=datetime.now()
                user_repo.save()
            else:
                user = User.objects.get(github_username=username)
                user_repo = UserGitHubRepository.objects.create(
                    user_id = user.id,
                    repo_name=repo_name,
                    github_username=username,
                    lang=str(res_json["language"]),
                    description=str(res_json["description"]),
                    topics=json.dumps(res_json["topics"]),
                    update_at=datetime.now()
                )
            memo = get_repo_memo(user_repo)
            user_repo.memo=memo
            user_repo.save()
            time.sleep(30)

def run_recommend_lecture_scheduler_job(user_id):
    N=3
    history_lectures_memo = LectureHistory.objects.filter(user_id=user_id).exclude(lecture__memo="").order_by("-id").values_list("lecture__memo", flat=True)[:N]
    print("history_lectures_memo", history_lectures_memo)
    
    lecture_memo ="최근 본 강의의 특징:\n"
    for memo in history_lectures_memo:
        lecture_memo += memo
        lecture_memo += "\n"
        if len(lecture_memo) > 500:
            break
        
    repo_memo = UserGitHubRepository.objects.values_list("memo", flat=True)
    print("repo_memo", repo_memo)
    # 강의 추천 
    chat_role = "assistant"
    guideline = "학습 가이드라인:\n"
    for memo in repo_memo:
        guideline += memo
        guideline += "\n"
        if len(guideline) > 500:
            break 

    suffix= "당신은 주어진 정보 내에서 유튜브 강의 영상을 추천해주는 시스템이다. 최근 본 강의의 특징과 학습 가이드라인을 보고 당신은 단계적으로 생각하여 추천하는 한국어 유튜브 영상 3~5개를 url과 추천이유를 한 줄로 짧게 쓴다. 만약 어떤 영상을 추천할지 모르겠다면 사용자를 초보자로 가정하고 입문에 적합한 프로그래밍 언어 학습 강의 영상을 추천한다. 흥미를 위한 것이므로 정확성에 신경 쓰지 않고 반드시 영상 url을 제시하여야 한다."
    content = lecture_memo + "\n" + guideline + "\n" + suffix
    print("content", content)
    openai.api_key = OPENAI_API_KEY
    openai.Model.list()

    chat_messages = [{"role": chat_role, "content": content}]
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=chat_messages,
        max_tokens=800,
    )
    answer = completion.choices[0].message['content']
    print("get_recommend_lecture", answer)
    urls = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', answer)
    print(urls)
    for url in urls:
        try:
            if ")" in url:
                url = url.replace(")", "")
            if "(" in url:
                url = url.replace("(", "")
                
            # 유튜브 영상 제목 수집
            video_id = get_video_id(url)
            if type(video_id) == list:
                video_id = video_id[0]
            print("video_id", video_id)
            api_url = "https://www.googleapis.com/youtube/v3/videos"
            params = {
                "part": "snippet",
                "id": video_id,
                "key": YOUTUBE_API_KEY,
            }
            res = requests.get(api_url, params=params)
            res_json = res.json()
            if len(res_json["items"]) > 0:
                video = res_json["items"][0]
                video_title = video["snippet"]["title"]
                # 강의 생성
                lectures = Lecture.objects.filter(video_link="https://www.youtube.com/watch?v="+video_id)
                if len(lectures) > 0:
                    lecture = lectures.first()
                else :
                    lecture = Lecture.objects.create(
                        title=video_title,
                        video_link="https://www.youtube.com/watch?v="+video_id,
                        author_id=21,
                        memo=""
                    )
                    print(f"{video_title} create")
                LectureRecommend.objects.create(
                    user_id=user_id,
                    lecture=lecture,
                    update_at=datetime.now()
                )
                print(f"{lecture.title} recommend create")
                
                
        except Exception as e:
            print(f"강의 저장 오류: {e}")

    return answer


# 유튜브 링크에서 video id 파싱
def get_video_id(url):
    if "v=" in url:
        url_data = urlparse(url)
        query = parse_qs(url_data.query)
        video_id = query.get("v", None)
        print("type", type(video_id), video_id)
        return video_id
    else:
        video_id = url.split("/")[-1]
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
        max_tokens=64
    )
    answer = completion.choices[0].message['content']
    print("get_lecture_memo", answer)
    # (휴리스틱) "장점:" 을 붙이는 경우 분리
    p_answer= answer.split('장점:')[-1]

    return p_answer

# github 정보를 이용한 리포지토리 관련 학습 가이드라인
def get_repo_memo(repo_obj):
    print("get_repo_memo")
    chat_role = "assistant"
    content = "GitHub Repository의 정보를 보고 당신은 학습 가이드라인을 한글로 짧게 제시하여야 한다. 먼저 어떤 알고리즘을 학습해야 하는지 한 줄로 제시하고 어떤 종류의 강의 영상을 시청해야 하는지 두 줄 이내로 제시한다. 이때, 실제 강의 영상은 추천하지 않고 영상의 주제를 추천한다. 정보가 부족하다면 프로그래밍의 초보자임을 가정하고 가이드라인을 제안한다. 정보가 부족하더라도 흥미를 위한 것이므로 정확성에 신경 쓰지 않고 반드시 가이드라인을 제시하여야 한다.\nGITHUB REPOSITORY 정보:\n"

    openai.api_key = OPENAI_API_KEY
    openai.Model.list()

    chat_messages = [{"role": chat_role, "content": content+repo_obj.to_info()}]
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=chat_messages,
        max_tokens=512
    )
    answer = completion.choices[0].message['content']
    print("get_repo_memo", answer)

    return answer
