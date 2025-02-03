import uuid

from django.db import models, transaction
from django.contrib.auth.models import AbstractUser, Group
from django.urls import reverse
from pytils.translit import slugify


class IP(models.Model):
    ip = models.CharField(max_length=100)

    def __str__(self):
        return self.ip

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Skill(models.Model):
    name = models.CharField(max_length=255, unique=True, help_text="Название умений")

    def __str__(self):
        return self.name


class User(AbstractUser):
    birthday = models.DateField(blank=True, null=True, help_text="Дата рождения пользователя")
    about = models.CharField(blank=True, null=True, max_length=1000, help_text="О пользователе")
    skill = models.ManyToManyField(Skill, help_text="Уменя пользователя")
    sex = models.CharField(blank=True, null=True, max_length=1, help_text="Пол пользователя. М/Ж")
    city = models.CharField(blank=True, null=True, max_length=170, help_text="Город проживания")
    company = models.CharField(blank=True, null=True, max_length=255, help_text="Компания в которой работает пользователь")
    passport = models.CharField(blank=True, null=True, max_length=10, help_text="Паспортные данные пользователя")
    document = models.CharField(blank=True, null=True, max_length=50, help_text="Документ пользователя")
    image = models.ImageField(upload_to="users/", blank=True, default='users/user.png')
    money = models.FloatField(blank=True, null=False, default=0, help_text="Актнуальный счет пользователя")
    total_money_sent = models.FloatField(blank=True, null=False, default=0, help_text="Сколько всего задонатил пользователь")
    category = models.ManyToManyField(Category, help_text="Интересные категории проектов для пользователя")
    confirmed = models.BooleanField(default=False, null=False, help_text="Подтвержден дли пользователь в системе")
    email_verified = models.BooleanField(default=False, null=False, help_text="Подтверждена ли почта пользователя")

    def __str__(self):
        return self.username

    def get_absolute_url(self):
        return reverse('profile', kwargs={'pk': self.pk})


class ProjectStatusCode(models.Model):
    code = models.IntegerField(null=False, help_text="Код статуса")
    name = models.CharField(null=False, max_length=255, help_text="Название статуса")

    def __str__(self):
        return f"{self.code} - {self.name}"


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
    closure_type = models.CharField(blank=False, null=False, max_length=10, default="BY_AMOUNT", help_text="Тип закрытия проекта. BY_AMOUNT - закрытие сбора по определенной сумме, BY_TIME - закрытие сбора по истечении времени")
    status_code = models.ForeignKey(ProjectStatusCode, on_delete=models.CASCADE, null=True,  help_text="Статус код проекта. 0 - не поступил в работу, 1 - в работе, 2 - сбор приостановлен, 3 - в архиве")
    transfer_allowed = models.BooleanField(default=False, null=False, help_text="Поле для разрешения снятии средств с проекта")
    views = models.ManyToManyField(IP, related_name='project_views')

    class Meta:
        ordering = ['pk']

    def __str__(self):
        return self.name

    def set_inwork_status(self):
        self.status_code = ProjectStatusCode.objects.get(code="1")
        self.save()

    def set_payment_stop_status(self):
        self.status_code = ProjectStatusCode.objects.get(code="2")
        self.save()

    def set_finish_status(self):
        self.status_code = ProjectStatusCode.objects.get(code="3")
        self.save()

    def set_allowed_transfer_status(self):
        self.transfer_allowed = True
        self.save()



    def get_absolute_url(self):
        return reverse('project_view', kwargs={'slug': self.slug})

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        return super().save(*args, **kwargs)


class ProjectImages(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='project_images')
    image = models.ImageField()


class ProjectConfirmAnswer(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='answer')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='admin')
    answer = models.CharField(null=True, max_length=1000)
    confirmed = models.BooleanField(null=False)
    answer_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project}"

class CashingOutProject(models.Model):
    project = models.ForeignKey(Project, on_delete=models.PROTECT, related_name='cashing_out_project')
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='cashing_out_user')
    money = models.FloatField(null=False, default=0)
    actual_amount = models.FloatField(null=False, default=0)
    idempotence_key = models.UUIDField(null=True, blank=True, unique=True)
    create_date = models.DateTimeField(null=True, blank=True)
    change_status_date = models.DateTimeField(null=True, blank=True)
    payout_id = models.UUIDField(null=True, blank=True)
    status = models.BooleanField(null=True, blank=True)



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
    create_date = models.DateField(null=True)

    def __str__(self):
        return self.project.name


class NewImageToProject(models.Model):
    project_change_request = models.ForeignKey(ProjectChangeRequest, on_delete=models.CASCADE, related_name='add_image')
    image = models.ImageField(upload_to="project/")

    def __str__(self):
        return f"{self.project_change_request}"


class AnswerProjectChangeRequest(models.Model):
    change_request = models.ForeignKey(ProjectChangeRequest, on_delete=models.PROTECT,
                                       related_name='answer_change_requests_project')
    admin = models.ForeignKey(User, on_delete=models.PROTECT, related_name='admin_change_requests_project')
    answer_description = models.CharField(max_length=2048, null=True, blank=True)
    confirmed = models.BooleanField(default=None, null=True)
    answer_date = models.DateTimeField(null=True)

    def __str__(self):
        return f"{self.change_request}"


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
    create_date = models.DateField(null=True)

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


class ProjectClosureRequest(models.Model):
    project = models.ForeignKey(Project, on_delete=models.PROTECT, related_name='project_closure')
    description = models.CharField(null=True)
    allowed = models.BooleanField(null=True)
    admin = models.ForeignKey(User, on_delete=models.PROTECT, related_name='admin_project_closure', null=True)
    date = models.DateTimeField(null=True, auto_now_add=True)
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

class CommissionRules(models.Model):
    min_percentage = models.FloatField(null=True, blank=True)
    max_percentage = models.FloatField(null=True, blank=True)
    commission_rate = models.FloatField(null=True, blank=True)

class AccountReplenishment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.FloatField(null=False, blank=False)
    status = models.BooleanField(null=True, blank=True)
    idempotence_key = models.UUIDField(null=True, unique=True, blank=True)
    create_date = models.DateTimeField(null=True, blank=True)
    change_status_date = models.DateTimeField(null=True, blank=True)
    payment_id = models.UUIDField(null=True, blank=True)

    def __str__(self):
        return f"{self.user} + {self.amount}, id={self.payment_id}"
