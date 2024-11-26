import uuid

from celery import shared_task
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from rest_framework.reverse import reverse

from crow.models import VerificationToken, User, ResetPasswordToken
from crowdfunding.settings import EMAIL_HOST_USER
from crowdfunding.celery import app


app.conf.beat_schedule = {
    'testing': {
        'task': 'test_task',
        'schedule': 5,
        'args': ('hello', )
    },
}

@app.task(name='test_task')
def test(text):
    print(text)

@shared_task
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


@shared_task
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