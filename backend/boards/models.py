from django.db import models

class Board(models.Model):
  id = models.AutoField(primary_key=True)
  title = models.CharField(max_length=500)
  create_at = models.DateTimeField(auto_now_add=True)

class Article(models.Model):
  id = models.AutoField(primary_key=True)
  title = models.CharField(max_length=500)
  body = models.TextField()
  board = models.ForeignKey(Board, models.CASCADE)
  author_id = models.BigIntegerField()
  create_at = models.DateTimeField(auto_now_add=True)
  update_at = models.DateTimeField(auto_now=True)
