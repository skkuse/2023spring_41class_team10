from django.db import models

class Lecture(models.Model):
  id = models.AutoField(primary_key=True)
  title = models.CharField(max_length=500)
  video_link = models.CharField(max_length=2000)
  author_id = models.BigIntegerField()
  create_at = models.DateTimeField(auto_now_add=True)
  
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

class LectureHistory(models.Model):
  id = models.AutoField(primary_key=True)
  lecture = models.ForeignKey(Lecture, models.CASCADE)
  user_id = models.BigIntegerField()
  create_at = models.DateTimeField(auto_now_add=True)
