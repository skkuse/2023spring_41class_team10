from django.db import models

class Lecture(models.Model):
  id = models.AutoField(primary_key=True)
  title = models.CharField(max_length=500)
  video_link = models.CharField(max_length=2000)
  author_id = models.BigIntegerField()
  create_at = models.DateTimeField(auto_now_add=True)
  memo = models.TextField(default="")
  def __str__(self) -> str:
    return f"#{self.id} {self.title}" 

class SoftwareField(models.Model):
  id = models.AutoField(primary_key=True)
  field = models.CharField(max_length=100)
  
  def __str__(self) -> str:
    return self.field

class LectureFieldRelation(models.Model):
  id = models.AutoField(primary_key=True)
  field = models.ForeignKey(SoftwareField, models.CASCADE)
  lecture = models.ForeignKey(Lecture, models.CASCADE)
  
  def __str__(self) -> str:
    return f"#{self.lecture.id} {self.lecture.title}_{self.field.field}"

# 유저의 강의 시청기록
class LectureHistory(models.Model):
  id = models.AutoField(primary_key=True)
  lecture = models.ForeignKey(Lecture, models.CASCADE)
  user_id = models.BigIntegerField()
  create_at = models.DateTimeField(auto_now_add=True)

# 유저의 강의 추천을 미리 저장
class LectureRecommend(models.Model):
  id = models.AutoField(primary_key=True)
  user_id = models.BigIntegerField()
  lecture = models.ForeignKey(Lecture, models.CASCADE)
  create_at = models.DateTimeField(auto_now_add=True)

class LectureComment(models.Model):
  id = models.AutoField(primary_key=True)
  lecture = models.ForeignKey(Lecture, models.CASCADE)
  comment = models.TextField()
  create_at = models.DateTimeField(auto_now_add=True)
  
  def __str__(self) -> str:
    return self.comment 
