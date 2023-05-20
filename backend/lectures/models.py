from django.db import models

class Lecture(models.Model):
  id = models.AutoField(primary_key=True)
  title = models.CharField(max_length=500)
  video_link = models.CharField(max_length=2000)
  author_id = models.BigIntegerField()
  create_at = models.DateTimeField(auto_now_add=True)

class SoftwareField(models.Model):
  id = models.AutoField(primary_key=True)
  field = models.CharField(max_length=100)

class LectureFieldRelation(models.Model):
  id = models.AutoField(primary_key=True)
  field = models.ForeignKey(SoftwareField, models.CASCADE)
  lecture = models.ForeignKey(Lecture, models.CASCADE)

class LectureHistory(models.Model):
  id = models.AutoField(primary_key=True)
  lecture = models.ForeignKey(Lecture, models.CASCADE)
  user_id = models.BigIntegerField()
  create_at = models.DateTimeField(auto_now_add=True)
