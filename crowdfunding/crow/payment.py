import json
import os
import uuid

from rest_framework import status
from rest_framework.response import Response
from yookassa import Configuration
from yookassa.domain.common import SecurityHelper
from yookassa.domain.notification import WebhookNotificationFactory, WebhookNotificationEventType

from crow.models import AccountReplenishment
from crow.utils import get_client_ip
from crowdfunding.settings import yookassa_payment


def check_payment_status(idempotence_key):
    payment_info = get_payment_info(idempotence_key)
    payment_object = AccountReplenishment.objects.get(idempotence_key=idempotence_key)
    payment_status = payment_info['status']
    if payment_status == 'succeeded':
        payment_object.status = True
    elif payment_status == 'canceled':
        payment_object.status = False
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
