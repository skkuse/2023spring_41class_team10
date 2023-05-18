from django.db import models

# Create your models here.

class Problem(models.Model):
  id = models.AutoField(primary_key=True)
  title = models.CharField(max_length=500)
  level = models.IntegerField()
  description = models.TextField()
  
class AlgorithmField(models.Model):
  id = models.AutoField(primary_key=True)
  field = models.CharField(max_length=100)

class ProblemFieldRelation(models.Model):
  id = models.AutoField(primary_key=True)
  field = models.ForeignKey(AlgorithmField, models.CASCADE)
  problem = models.ForeignKey(Problem, models.CASCADE)
  
class Testcase(models.Model):
  id = models.AutoField(primary_key=True)
  problem = models.ForeignKey(Problem, models.CASCADE)
  testcase = models.TextField()
  result = models.TextField()
  is_sample = models.BooleanField()

class Execution(models.Model):
  id = models.AutoField(primary_key=True)
  problem = models.ForeignKey(Problem, models.CASCADE)
  lang = models.CharField()
  create_at = models.DateTimeField(auto_now_add=True)
  status = models.CharField(max_length=20)
  exec_time = models.FloatField()
  user = models.BigIntegerField()
  result = models.TextField() # 유저 테스트케이스 실행 결과

class Submission(models.Model):
  id = models.AutoField(primary_key=True)
  problem = models.ForeignKey(Problem, models.CASCADE)
  lang = models.CharField()
  create_at = models.DateTimeField(auto_now_add=True)
  status = models.CharField(max_length=20)
  exec_time = models.FloatField()
  user = models.BigIntegerField()

class UserCodeHistory(models.Model):
  id = models.AutoField(primary_key=True)
  user = models.BigIntegerField()
  version = models.IntegerField()
  code = models.TextField()
  memo = models.TextField()
