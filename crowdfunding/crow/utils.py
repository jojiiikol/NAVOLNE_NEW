import uuid
from django.core.mail import send_mail
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from crow.models import VerificationToken, ProjectStatusCode, CommissionRules, IP
from crowdfunding.settings import EMAIL_HOST_USER, EMAIL_VERIFICATION_TOKEN_LIFETIME


def check_token_timelife(token):
    if timezone.now() - token.created_at > EMAIL_VERIFICATION_TOKEN_LIFETIME:
        token.delete()
        return Response(data={"Ссылка недействительна"}, status=status.HTTP_200_OK)


def change_transfer_status(project):
    if project.closure_type == "BY_AMOUNT":
        if check_transfer_possibility(project):
            project.set_allowed_transfer_status()

def result_amount_with_commission(project):
    money = project.collected_money
    commission = get_commission_rate(project)
    commission_amount = money / 100 * commission
    actual_amount = money - commission_amount
    return actual_amount

def get_commission_rate(project):
    percentage = get_sum_percentage(project)
    try:
        rule = CommissionRules.objects.get(
            min_percentage__lte=percentage,
            max_percentage__gte=percentage,
        )
        return rule.commission_rate
    except CommissionRules.DoesNotExist:
        if percentage > 100:
            more_100_rule = CommissionRules.objects.get(max_percentage=None)
            return more_100_rule.commission_rate
        else:
            return None


def check_transfer_possibility(project):
    perecentage = get_sum_percentage(project)
    rule = CommissionRules.objects.order_by('min_percentage').first()
    if perecentage >= rule.min_percentage:
        return True
    return False


def get_sum_percentage(project):
    return project.collected_money / project.need_money * 100

def save_ip_view(request, project):
    request_ip = get_client_ip(request)
    ip, _ = IP.objects.get_or_create(ip=request_ip)
    project.views.add(ip)

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip