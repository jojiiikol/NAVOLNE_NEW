from django.db import transaction
from django.utils import timezone
from django_celery_beat.models import PeriodicTask

from crow.models import CashingOutProject, AccountReplenishment, Payout
from crow.utils import get_commission_rate


@transaction.atomic
def cash_out_project(project):
    money = project.collected_money
    commission = get_commission_rate(project)
    commission_amount = money / 100 * commission
    actual_amount = money - commission_amount

    cashing_out_data = CashingOutProject()
    cashing_out_data.project = project
    cashing_out_data.user = project.user
    cashing_out_data.money = project.collected_money
    cashing_out_data.actual_amount = actual_amount
    cashing_out_data.save()

    project.user.money += actual_amount
    project.user.save()

    project.transfer_allowed = False
    project.save()


@transaction.atomic
def make_payout_object(validated_data):
    validated_data['created_date'] = timezone.now()
    payout = Payout.objects.create(**validated_data)
    user = validated_data['user']
    user.money -= validated_data['amount']
    user.save()
    return payout


@transaction.atomic
def payment_to_project(validated_data):
    user = validated_data['user']
    user.money -= validated_data['money']
    user.save()

    project = validated_data['project']
    project.collected_money += validated_data['money']
    project.save()
