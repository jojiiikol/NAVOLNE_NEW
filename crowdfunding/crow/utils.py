import uuid
from django.core.mail import send_mail
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from crow.models import VerificationToken, ProjectStatusCode
from crowdfunding.settings import EMAIL_HOST_USER, EMAIL_VERIFICATION_TOKEN_LIFETIME



def check_token_timelife(token):
    if timezone.now() - token.created_at > EMAIL_VERIFICATION_TOKEN_LIFETIME:
        token.delete()
        return Response(data={"Ссылка недействительна"}, status=status.HTTP_200_OK)


def check_transfer_status(project):
    if project.collected_money >= project.need_money:
        change_transfer_status(project)


def change_transfer_status(project):
    project.transfer_allowed = True
    project.save()

def set_payment_stop_status(project):
    project.status_code = ProjectStatusCode.objects.get(code="2")
    project.save()