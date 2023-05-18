from django.db import models
from problems.models import UserCodeHistory

class Commit(models.Model):
  id = models.AutoField(primary_key=True)
  commit_message = models.TextField()
  user_id = models.BigIntegerField()
  repo_name = models.CharField(max_length=200)

class Review(models.Model):
  id = models.AutoField(primary_key=True)
  code = models.TextField()
  message = models.TextField()
  history = models.ForeignKey(UserCodeHistory, models.CASCADE)

class Comment(models.Model):
  id = models.AutoField(primary_key=True)
  code = models.TextField()
  message = models.TextField()
  history = models.ForeignKey(UserCodeHistory, models.CASCADE)

class Deadcode(models.Model):
  id = models.AutoField(primary_key=True)
  code = models.TextField()
  message = models.TextField()
  history = models.ForeignKey(UserCodeHistory, models.CASCADE)

class Refactor(models.Model):
  id = models.AutoField(primary_key=True)
  code = models.TextField()
  message = models.TextField()
  history = models.ForeignKey(UserCodeHistory, models.CASCADE)
