from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, github_username, username, password="", email="example@example.com", profile_image_url="", **extra_fields):
        if not github_username:
            raise ValueError('github_username must not be None')
        if not email:
            raise ValueError('email must not be None')
        email = self.normalize_email(email)
        user = self.model(github_username=github_username,
                        username=username,
                        email=email,
                        profile_image_url = profile_image_url,
                        **extra_fields)
        if password == "":
            user.set_password(self.make_random_password())
        else:
            user.set_password(password)
        user.save()
        return user


    def create_superuser(self, github_username, password, **extra_fields):

        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(github_username, username=github_username, password=password, **extra_fields)


class User(AbstractBaseUser):
    username = models.CharField(max_length=50, default="")
    github_username = models.CharField(max_length=50, unique=True, db_index=True)
    email = models.CharField(max_length=200, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(default=timezone.now)
    profile_image_url = models.URLField(default="")
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = UserManager()

    USERNAME_FIELD = 'github_username'

    def __str__(self):
        return self.github_username
    
    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    def to_json(self):
        return {
            "id" : self.id,
            "username" : self.username,
            "github_username": self.github_username,
            "email" : self.email,
            "created_at" : self.created_at,
            "last_login" : self.last_login,
            "profile_image_url" : self.profile_image_url
        }

    def login(self):
        self.last_login=timezone.now()
        self.save()
