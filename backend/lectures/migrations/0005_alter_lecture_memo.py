# Generated by Django 4.1.7 on 2023-06-10 04:36

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("lectures", "0004_alter_lecture_memo"),
    ]

    operations = [
        migrations.AlterField(
            model_name="lecture",
            name="memo",
            field=models.TextField(blank=True, default="", null=True),
        ),
    ]
