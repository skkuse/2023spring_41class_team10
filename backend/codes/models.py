from django.db import models
from problems.models import UserCodeHistory, Submission

class Commit(models.Model):
  id = models.AutoField(primary_key=True)
  commit_message = models.TextField()
  user_id = models.BigIntegerField()
  repo_name = models.CharField(max_length=200)
  create_at = models.DateTimeField(auto_now_add=True)

class Review(models.Model):
  id = models.AutoField(primary_key=True)
  code = models.TextField()
  message = models.TextField()
  target = models.ForeignKey(Submission, models.CASCADE, null=True)
  create_at = models.DateTimeField(auto_now_add=True)

class Comment(models.Model):
  id = models.AutoField(primary_key=True)
  code = models.TextField()
  message = models.TextField()
  target = models.ForeignKey(Submission, models.CASCADE, null=True)
  create_at = models.DateTimeField(auto_now_add=True)

class Deadcode(models.Model):
  id = models.AutoField(primary_key=True)
  code = models.TextField()
  message = models.TextField()
  target = models.ForeignKey(Submission, models.CASCADE, null=True)
  create_at = models.DateTimeField(auto_now_add=True)

class Refactor(models.Model):
  id = models.AutoField(primary_key=True)
  code = models.TextField()
  message = models.TextField()
  target = models.ForeignKey(Submission, models.CASCADE, null=True)
  create_at = models.DateTimeField(auto_now_add=True)
