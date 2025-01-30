import json
import uuid

from rest_framework import status
from rest_framework.response import Response
from yookassa import Configuration
from yookassa.domain.common import SecurityHelper
from yookassa.domain.notification import WebhookNotificationFactory, WebhookNotificationEventType

from crow.utils import get_client_ip
from crowdfunding.settings import yookassa_payment


def check_payment_status(request):
    ip = get_client_ip(request)
    if not SecurityHelper().is_ip_trusted(ip):
        return Response(status=status.HTTP_400_BAD_REQUEST)

    event_json = json.loads(request.body)
    try:
        notification_object = WebhookNotificationFactory().create(event_json)
        response_object = notification_object.object
        if notification_object.event == WebhookNotificationEventType.PAYMENT_SUCCEEDED:
            some_data = {
                'paymentId': response_object.id,
                'paymentStatus': response_object.status,
            }
        elif notification_object.event == WebhookNotificationEventType.PAYMENT_WAITING_FOR_CAPTURE:
            some_data = {
                'paymentId': response_object.id,
                'paymentStatus': response_object.status,
            }
        elif notification_object.event == WebhookNotificationEventType.PAYMENT_CANCELED:
            some_data = {
                'paymentId': response_object.id,
                'paymentStatus': response_object.status,
            }
        elif notification_object.event == WebhookNotificationEventType.REFUND_SUCCEEDED:
            some_data = {
                'refundId': response_object.id,
                'refundStatus': response_object.status,
                'paymentId': response_object.payment_id,
            }
        elif notification_object.event == WebhookNotificationEventType.DEAL_CLOSED:
            some_data = {
                'dealId': response_object.id,
                'dealStatus': response_object.status,
            }
        elif notification_object.event == WebhookNotificationEventType.PAYOUT_SUCCEEDED:
            some_data = {
                'payoutId': response_object.id,
                'payoutStatus': response_object.status,
                'dealId': response_object.deal.id,
            }
        elif notification_object.event == WebhookNotificationEventType.PAYOUT_CANCELED:
            some_data = {
                'payoutId': response_object.id,
                'payoutStatus': response_object.status,
                'dealId': response_object.deal.id,
            }
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    except Exception:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_200_OK)


def create_payment(value, user):
    idempotence_key = uuid.uuid4()
    payment = yookassa_payment.Payment.create({
        "amount": {
            "value": value,
            "currency": "RUB"
        },
        "confirmation": {
            "type": "redirect",
            "return_url": "http://localhost:8000/projects/1"
        },
        "capture": True,
        "description": f"Пополнение баланса для пользователя: {user.username}"
    }, idempotence_key)
    return payment, idempotence_key


def get_payment_info(idempotence_key):
    return yookassa_payment.Payment.find_one(idempotence_key)
