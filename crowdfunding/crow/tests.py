from django.contrib.auth.models import Group
from rest_framework import status
from rest_framework.test import APITestCase
from django.test.client import MULTIPART_CONTENT, encode_multipart, BOUNDARY
from crow.serializers import project_serializer
from crow.serializers import listings_serializer
from crow.serializers import profile_serializer
from crow.models import *


def make_all_users():
    non_confirmed_user = User.objects.create_user(
        username='non_confirmed_user',
        email='test@mail.ru',
        password='123456aA',
        first_name='first_name',
        last_name='last_name',
        confirmed=False
    )

    confirmed_user = User.objects.create_user(
        username='confirmed_user',
        email='test@mail.ru',
        password='123456aA',
        first_name='first_name',
        last_name='last_name',
        confirmed=False
    )

    admin_user = User.objects.create_user(
        username='confirmed_user',
        email='test@mail.ru',
        password='123456aA',
        first_name='first_name',
        last_name='last_name',
        confirmed=True,
        is_staff=True,
        is_superuser=True
    )

    return non_confirmed_user, confirmed_user, admin_user


class ProfileTest(APITestCase):
    def setUp(self):

        self.test_user = User.objects.create_user(
            username='Test_user',
            email='test@mail.ru',
            password='123456aA',
            first_name='first_name',
            last_name='last_name',
            money=1500,
            is_active=True,
            confirmed = False
        )

        self.group_1 = Group.objects.create(
            name='Test Group 1',
        )

    def test_authorization(self):
        login_url = reverse('token_obtain_pair')
        token = self.client.post(login_url, {'username': 'Test_user', 'password': '123456aA'}, format='json').data[
            'access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

    def test_registration(self):
        registration_url = reverse('user-list')
        answer = self.client.post(
            registration_url, data = {
                'username': 'testusertwo',
                'email': 'skater886@mail.ru',
                'password_1': '78946656265aA',
                'password_2': '78946656265aA',
                'last_name': 'test',
                'first_name': 'test',
                'groups': [self.group_1.pk]
            }, format='json'
        )

        self.assertEqual(answer.status_code, status.HTTP_201_CREATED)


class TransactionTest(APITestCase):
    def setUp(self):
        non_confirmed_user, confirmed_user, admin_user = make_all_users()

