from datetime import timedelta

from django.db import transaction
from django.utils import timezone
from django_celery_beat.models import PeriodicTask
from yookassa import Payout
from crow.models import Payout as PayoutModel
from crow.utils import result_amount_with_commission
import uuid
import yookassa
from yookassa.domain.models.currency import Currency

from crowdfunding.settings import PAYOUT_AGENT_ID, PAYOUT_SECRET_KEY


def yookassa_authorization():
    yookassa.Configuration.account_id = PAYOUT_AGENT_ID
    yookassa.Configuration.secret_key = PAYOUT_SECRET_KEY

def do_payout(payout_id):
    payout_info_status = check_payout_status(payout_id)
    payout_name = "Payout " + str(payout_id)
    task = PeriodicTask.objects.get(name=payout_name)
    if payout_info_status is not None:
        do_payout_atomic(payout_id, payout_info_status, task)
        if not payout_info_status:
            return_money_to_account(payout_id)
    delete_payment_task_on_time(task)

def return_money_to_account(payout_id):
    payout_obj = PayoutModel.objects.get(payout_id=payout_id)
    user = payout_obj.user
    amount = payout_obj.amount
    user.money += amount
    user.save()


@transaction.atomic
def do_payout_atomic(payout_id, payout_info_status, task):
    payout_object = change_payout_status(payout_id, payout_info_status)
    task.delete()

def change_payout_status(payout_id, payout_info_status):
    payout_object = PayoutModel.objects.get(payout_id=payout_id)
    payout_object.status = payout_info_status
    payout_object.save()
    return payout_object


def delete_payment_task_on_time(task):
    if timezone.now() - task.start_time >= timedelta(minutes=15):
        payout_id = task.name.split(' ')[1]
        return_money_to_account(payout_id)
        task.delete()

def check_payout_status(payout_id):
    payout_info = get_payout_info(payout_id)
    payout_status = payout_info['status']
    if payout_status == 'succeeded':
        return True
    elif payout_status == 'canceled':
        return False
    else:
        return None

def create_payout(payout_token, amount, username):
    yookassa_authorization()
    idempotence_key = str(uuid.uuid4())
    payout = Payout.create({
        "amount": {
            "value": amount,
            "currency": "RUB"
        },
        "payout_token": payout_token,
        "description": f"Выплата с баланса для пользователя {username}",
    }, idempotence_key)
    return payout

def get_payout_info(payout_id):
    yookassa_authorization()
    return yookassa.Payout.find_one(payout_id)
