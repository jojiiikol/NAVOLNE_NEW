import json
import os
import uuid
from datetime import timedelta

from django.utils import timezone
from django_celery_beat.models import PeriodicTask
from rest_framework import status
from rest_framework.response import Response
from yookassa import Configuration
from yookassa.domain.common import SecurityHelper
from yookassa.domain.notification import WebhookNotificationFactory, WebhookNotificationEventType

from crow.models import AccountReplenishment
from crow.utils import get_client_ip
from crowdfunding.settings import yookassa_payment


def change_payment_status(payment_id):
    payment_object = AccountReplenishment.objects.get(payment_id=payment_id)
    payment_info_status = check_payment_status(payment_id)
    task = PeriodicTask.objects.get(name=payment_id)
    if payment_info_status is not None:
        payment_object.status = payment_info_status
        payment_object.save()
        task.delete()
    delete_payment_task_on_time(task)


def delete_payment_task_on_time(task):
    if timezone.now() - task.start_time >= timedelta(minutes=15):
        task.delete()


def check_payment_status(idempotence_key):
    payment_info = get_payment_info(idempotence_key)
    payment_status = payment_info['status']
    if payment_status == 'succeeded':
        return True
    elif payment_status == 'canceled':
        return False
    else:
        return None


def create_payment(value, user):
    idempotence_key = uuid.uuid4()
    payment = yookassa_payment.Payment.create({
        "amount": {
            "value": value,
            "currency": "RUB"
        },
        "confirmation": {
            "type": "redirect",
            "return_url": os.getenv("URL")
        },
        "capture": True,
        "description": f"Пополнение баланса для пользователя: {user.username}"
    }, idempotence_key)
    return payment, idempotence_key


def get_payment_info(idempotence_key):
    return yookassa_payment.Payment.find_one(idempotence_key)
