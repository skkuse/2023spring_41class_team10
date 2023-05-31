from django.db import models

class Problem(models.Model):
  id = models.AutoField(primary_key=True)
  title = models.CharField(max_length=500)
  level = models.IntegerField()
  description = models.TextField()
  create_at = models.DateTimeField(auto_now_add=True)
  
  def __str__(self) -> str:
    return f"#{self.id} {self.title}" 

class AlgorithmField(models.Model):
  id = models.AutoField(primary_key=True)
  field = models.CharField(max_length=100)
  
  def __str__(self) -> str:
    return self.field

class ProblemFieldRelation(models.Model):
  id = models.AutoField(primary_key=True)
  field = models.ForeignKey(AlgorithmField, models.CASCADE)
  problem = models.ForeignKey(Problem, models.CASCADE)
  
  def __str__(self) -> str:
    return f"#{self.problem.id} {self.problem.title}_{self.field.field}"
  
class Testcase(models.Model):
  id = models.AutoField(primary_key=True)
  problem = models.ForeignKey(Problem, models.CASCADE)
  testcase = models.TextField()
  result = models.TextField()
  is_sample = models.BooleanField()

  def __str__(self) -> str:
    return f"#{self.problem.id} {self.problem.title}"

class Execution(models.Model):
  id = models.AutoField(primary_key=True)
  problem = models.ForeignKey(Problem, models.CASCADE)
  lang = models.CharField(max_length=50)
  create_at = models.DateTimeField(auto_now_add=True)
  status = models.CharField(max_length=20)
  exec_time = models.FloatField()
  user = models.BigIntegerField()
  result = models.TextField() # 유저 테스트케이스 실행 결과

class Submission(models.Model):
  id = models.AutoField(primary_key=True)
  problem = models.ForeignKey(Problem, models.CASCADE)
  lang = models.CharField(max_length=50)
  create_at = models.DateTimeField(auto_now_add=True)
  status = models.CharField(max_length=20)
  exec_time = models.FloatField()
  user = models.BigIntegerField()
  num_pass = models.IntegerField()

# 유저가 저장버튼을 눌러 저장한 코드
class UserCodeHistory(models.Model):
  id = models.AutoField(primary_key=True)
  user = models.BigIntegerField()
  problem = models.ForeignKey(Problem, models.CASCADE)
  version = models.IntegerField()
  code = models.TextField()
  memo = models.TextField()
  create_at = models.DateTimeField(auto_now_add=True)
