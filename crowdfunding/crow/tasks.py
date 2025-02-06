import json
import uuid

from celery import shared_task
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils import timezone
from django_celery_beat.models import IntervalSchedule, PeriodicTask
from rest_framework.reverse import reverse

from crow.models import VerificationToken, User, ResetPasswordToken, Project, ProjectStatusCode
from crow.yookassa_crow.payment import account_replenishment
from crow.utils import check_transfer_possibility
from crow.yookassa_crow.payout import do_payout
from crowdfunding.settings import EMAIL_HOST_USER
from crowdfunding.celery import app


app.conf.beat_schedule = {
    'check_transfer_status': {
        'task': 'time_check_transfer_status',
        'schedule': 60*60,
    },
}


@app.task(name='time_check_transfer_status', queue='transfer_status_queue')
def time_check_transfer_status():
    projects = Project.objects.filter(closure_type="BY_TIME")
    for project in projects:
        if timezone.now().date() >= project.end_date and project.status_code == ProjectStatusCode.objects.get(code=1):
            if check_transfer_possibility(project):
                project.set_allowed_transfer_status()
            project.set_payment_stop_status()
            print(f"{project.name} закрыт")


@shared_task(queue='email_queue')
def send_message_verification_email(user_id):
    user = User.objects.get(pk=user_id)
    user_email = user.email
    email_verification_token = uuid.uuid4()
    email_verification_url = reverse('email_verification', args=[email_verification_token])
    send_mail(
        'Подтверждение почты NAVOLNE',
        f'Привет, для подтверждения электронной почты, просим перейти по ссылке: http://localhost:8000{email_verification_url}',
        EMAIL_HOST_USER,
        [user_email],
        fail_silently=False,
    )
    VerificationToken.objects.create(user=user, token=email_verification_token)


@shared_task(queue='email_queue')
def send_reset_password_message(user_id):
    user = User.objects.get(pk=user_id)
    token = default_token_generator.make_token(user)
    reset_url = reverse('reset_password', args=[token])
    send_mail(
        'NAVOLNE. Изменение пароля',
        f'Для сброса пароля перейдите по этой ссылке: http://localhost:8000{reset_url}',
        EMAIL_HOST_USER,
        [user.email],
        fail_silently=False,
    )
    ResetPasswordToken.objects.create(user=user, token=token)

def create_check_payment_status_task(payment_id):
    schedule, created = IntervalSchedule.objects.get_or_create(
        every=1,
        period=IntervalSchedule.MINUTES
    )

    PeriodicTask.objects.create(
        interval=schedule,
        name="Payment " + payment_id,
        task="crow.tasks.check_payment_status_task",
        start_time=timezone.now(),
        args=json.dumps([payment_id]),
    )

def create_check_payout_status_task(payout_id):
    schedule, created = IntervalSchedule.objects.get_or_create(
        every=1,
        period=IntervalSchedule.MINUTES
    )

    PeriodicTask.objects.create(
        interval=schedule,
        name="Payout " + payout_id,
        task="crow.tasks.check_payout_status_task",
        start_time=timezone.now(),
        args=json.dumps([payout_id]),
    )
@shared_task(queue='yookassa_queue')
def check_payment_status_task(payment_id):
    account_replenishment(payment_id)

@shared_task(queue='yookassa_queue')
def check_payout_status_task(payout_id):
    do_payout(payout_id)

