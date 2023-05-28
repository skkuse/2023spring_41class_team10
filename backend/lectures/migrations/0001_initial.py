# Generated by Django 4.1.7 on 2023-05-19 04:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Lecture',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=500)),
                ('video_link', models.CharField(max_length=2000)),
                ('author_id', models.BigIntegerField()),
                ('create_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='SoftwareField',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('field', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='LectureHistory',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('user_id', models.BigIntegerField()),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('lecture', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lectures.lecture')),
            ],
        ),
        migrations.CreateModel(
            name='LectureFieldRelation',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('field', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lectures.softwarefield')),
                ('lecture', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lectures.lecture')),
            ],
        ),
    ]
