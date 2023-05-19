from django.db import models

# Create your models here.
class Problem(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=500)
    level = models.IntegerField()
    description = models.TextField()

    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        return self.field_name