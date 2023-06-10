from django.db import models

class Board(models.Model):
  id = models.AutoField(primary_key=True)
  title = models.CharField(max_length=500, unique=True)
  create_at = models.DateTimeField(auto_now_add=True)
  
  def __str__(self) -> str:
    return self.title

class Article(models.Model):
  id = models.AutoField(primary_key=True)
  title = models.CharField(max_length=500)
  body = models.TextField()
  board = models.ForeignKey(Board, models.CASCADE)
  author_id = models.BigIntegerField()
  create_at = models.DateTimeField(auto_now_add=True)
  update_at = models.DateTimeField(auto_now=True)
  
  def to_json(self):
    return {
      "id":self.id,
      "title":self.title,
      "body":self.body,
      "board":self.board.title,
      "author_id":self.author_id,
      "create_at":self.create_at,
      "update_at":self.update_at
    }
