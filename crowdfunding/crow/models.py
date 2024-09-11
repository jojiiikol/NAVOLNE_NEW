import profile
import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser, Group
from django.urls import reverse
from pytils.translit import slugify


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Skill(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class User(AbstractUser):
    birthday = models.DateField(blank=True, null=True)
    about = models.CharField(blank=True, null=True, max_length=1000)
    skill = models.ManyToManyField(Skill)
    sex = models.CharField(blank=True, null=True, max_length=1)
    city = models.CharField(blank=True, null=True, max_length=170)
    company = models.CharField(blank=True, null=True, max_length=255)
    passport = models.CharField(blank=True, null=True, max_length=10)
    document = models.CharField(blank=True, null=True, max_length=50)
    image = models.ImageField(upload_to="users/", blank=True, default='users/user.png')
    money = models.FloatField(blank=True, null=False, default=0)
    total_money_sent = models.FloatField(blank=True, null=False, default=0)
    category = models.ManyToManyField(Category)
    confirmed = models.BooleanField(default=False, null=False)
    email_verified = models.BooleanField(default=False, null=False)

    def __str__(self):
        return self.username

    def get_absolute_url(self):
        return reverse('profile', kwargs={'pk': self.pk})


class Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='projects')
    name = models.CharField(max_length=27, unique=True)
    small_description = models.CharField(max_length=150)
    description = models.CharField(max_length=1000)
    need_money = models.FloatField()
    collected_money = models.FloatField()
    start_date = models.DateField()
    end_date = models.DateField()
    category = models.ManyToManyField(Category, related_name='project_category')
    image = models.ImageField(upload_to="project/", default="project/no_image.jpg")
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    views = models.IntegerField(default=0)
    confirmed = models.BooleanField(default=False, null=False)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('project_view', kwargs={'slug': self.slug})

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        return super().save(*args, **kwargs)

class ProjectConfirmAnswer(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='answer')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='admin')
    answer = models.CharField(null=True, max_length=1000)
    confirmed = models.BooleanField(null=False)
    answer_time = models.DateTimeField(auto_now_add=True)

class ProjectChangeRequest(models.Model):
    project = models.ForeignKey(Project, on_delete=models.PROTECT, related_name='change_requests_project')
    name = models.CharField(max_length=27)
    small_description = models.CharField(max_length=150)
    description = models.CharField(max_length=1000)
    need_money = models.FloatField(null=True)
    end_date = models.DateField(null=True)
    category = models.ManyToManyField(Category)
    image = models.ImageField(upload_to="project/", default="project/no_image.jpg")
    description_for_change = models.CharField(max_length=2048, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='change_requests_user', null=True)
    create_date = models.DateField(null=True, auto_now_add=True)


    def __str__(self):
        return f"{self.project}"

class AnswerProjectChangeRequest(models.Model):
    change_request = models.ForeignKey(ProjectChangeRequest, on_delete=models.PROTECT, related_name='answer_change_requests_project')
    admin = models.ForeignKey(User, on_delete=models.PROTECT, related_name='admin_change_requests_project')
    answer_description = models.CharField(max_length=2048, null=True, blank=True)
    confirmed = models.BooleanField(default=None, null=True)
    answer_date = models.DateTimeField(null=True)


class ProfileChangeRequest(models.Model):
    profile = models.ForeignKey(User, on_delete=models.PROTECT, related_name='change_requests_profile')
    username = models.CharField(max_length=255, null=True)
    first_name = models.CharField(max_length=255, null=True)
    last_name = models.CharField(max_length=255, null=True)
    about = models.CharField(null=True, max_length=1000)
    sex = models.CharField(null=True, max_length=1)
    city = models.CharField(null=True, max_length=170)
    company = models.CharField(null=True, max_length=255)
    passport = models.CharField(null=True, max_length=10)
    document = models.CharField(null=True, max_length=50)
    image = models.ImageField(upload_to="users/", blank=True)
    group = models.ForeignKey(Group, on_delete=models.PROTECT, related_name='change_requests_group', null=True)
    description_for_change = models.CharField(max_length=2048, null=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT, null=False, related_name='change_profile_user')
    create_date = models.DateField(null=True, auto_now_add=True)

    def __str__(self):
        return f"{self.profile.username}"

class ProfileConfirmAnswer(models.Model):
    profile = models.ForeignKey(User, on_delete=models.CASCADE, related_name='confirm_profile_answer')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='confirm_profile_admin')
    answer = models.CharField(null=True, max_length=1000)
    confirmed = models.BooleanField(null=False)
    answer_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.profile.username}"

class AnswerProfileChangeRequest(models.Model):
    profile = models.ForeignKey(ProfileChangeRequest, on_delete=models.PROTECT, related_name='answer_request')
    admin = models.ForeignKey(User, on_delete=models.PROTECT, related_name='change_profile_admin')
    answer_description = models.CharField(max_length=2048, null=True, blank=True)
    confirmed = models.BooleanField(default=None, null=True)
    answer_date = models.DateTimeField(null=True)

class Transaction(models.Model):
    project = models.ForeignKey(Project, on_delete=models.PROTECT)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    money = models.FloatField(null=False)

    def __str__(self):
        return f"{self.user}-->{self.project}={self.money}"


class VerificationToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username


class ResetPasswordToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username

