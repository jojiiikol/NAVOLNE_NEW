from django.db import transaction
from django_celery_beat.models import PeriodicTask

from crow.models import CashingOutProject, AccountReplenishment
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



