# Generated by Django 4.1.7 on 2023-06-10 05:46

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0006_usergithubrepository_github_username"),
    ]

    operations = [
        migrations.AlterField(
            model_name="usergithubrepository",
            name="github_username",
            field=models.CharField(default="", max_length=50),
        ),
    ]
