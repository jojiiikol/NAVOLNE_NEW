from django.contrib.auth.models import Group
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.core.validators import RegexValidator
from django.utils import timezone
from drf_spectacular.utils import extend_schema_serializer
from rest_framework import serializers
from rest_framework.reverse import reverse
from rest_framework.validators import UniqueValidator
from crow.models import User, ResetPasswordToken, ProfileChangeRequest, Skill, Category, AnswerProfileChangeRequest, \
    ProfileConfirmAnswer, AccountReplenishment, Payout
import datetime

from crow.transactions import make_payout_object
from crow.validators import SQL_INJECTION_CHARACTERS
from crowdfunding.settings import EMAIL_HOST_USER
from crow.tasks import send_reset_password_message

import logging
# Set the logging level to DEBUG
logging.basicConfig(level=logging.DEBUG)
# Create a logger
logger = logging.getLogger(__name__)
# Log a message


class UserSerializer(serializers.ModelSerializer):
    user_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'image', 'email', 'user_url')

    def get_user_url(self, obj):
        return reverse('user-detail', kwargs={'username': obj.username}, request=self.context['request'])


class EmailForResetPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email',)

    email = serializers.EmailField(required=True)

    def validate(self, attrs):
        try:
            user = User.objects.get(email=attrs['email'])
        except User.DoesNotExist:
            raise serializers.ValidationError('Пользователь с таким email не найден')
        return attrs

    def save(self, **kwargs):
        user = User.objects.get(email=self.validated_data['email'])
        send_reset_password_message.delay(user.pk)
        return user


class ResetPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('password_1', 'password_2')

    password_1 = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_2 = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        if attrs['password_1'] != attrs['password_2']:
            raise serializers.ValidationError({'password': 'Пароли не совпадают'})
        return attrs

    def update(self, instance, validated_data):
        user = instance
        user.set_password(validated_data['password_1'])
        user.save()
        return instance


class ConfirmUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileConfirmAnswer
        fields = ('user', 'answer', 'confirmed', 'answer_time')

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    answer = serializers.CharField(required=False, max_length=1000)
    confirmed = serializers.BooleanField(required=True)
    answer_time = serializers.DateTimeField(default=timezone.now())

    def update_profile(self, profile):
        profile.confirmed = self.validated_data['confirmed']
        profile.save()


class AnswerChangeProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerProfileChangeRequest
        fields = (
            'admin', 'answer_description', 'confirmed', 'answer_date'
        )

    admin = serializers.HiddenField(default=serializers.CurrentUserDefault())
    answer_description = serializers.CharField(help_text="Ответ админа на заявку", required=False)
    confirmed = serializers.BooleanField(required=True,
                                         help_text="true/false. В случае передачи true - в профиль вносятся изменения")
    answer_date = serializers.DateTimeField(required=False, default=timezone.now(),
                                            help_text="Необязательное поле. Заполняется автоматически")

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['admin'] = UserSerializer((instance.admin),
                                                 context={"request": self.context.get('request')}).data
        return representation

    def update_profile(self, instance, new_data_profile):
        instance.username = new_data_profile.username or instance.username
        instance.image = new_data_profile.image or instance.image
        instance.first_name = new_data_profile.first_name or instance.first_name
        instance.last_name = new_data_profile.last_name or instance.last_name
        instance.about = new_data_profile.about or instance.about
        instance.sex = new_data_profile.sex or instance.sex
        instance.company = new_data_profile.company or instance.company
        instance.passport = new_data_profile.passport or instance.passport
        instance.document = new_data_profile.document or instance.document
        instance.birthday = new_data_profile.birthday or instance.birthday
        if new_data_profile.group:
            instance.groups.clear()
            instance.groups.add(new_data_profile.group)
        instance.city = new_data_profile.city or instance.city
        instance.save()
        return instance


class ChangeProfileRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileChangeRequest
        fields = (
            'pk', 'username', 'image', 'first_name', 'last_name', 'about', 'sex', 'company', 'passport',
            'document', 'group', 'city', 'description_for_change', 'user', 'create_date', 'url', 'answer_request', 'birthday'
        )

    username = serializers.CharField(required=False, max_length=255, validators=[
        UniqueValidator(queryset=ProfileChangeRequest.objects.all(),
                        message="Пользователь с таким username уже существует"),
        UniqueValidator(queryset=User.objects.all(), message="Пользователь с таким username уже существует"),
        RegexValidator(regex=SQL_INJECTION_CHARACTERS, message="Username не валиден")
    ], help_text="Юзернейм пользователя")
    image = serializers.ImageField(required=False, help_text="Изображение пользователя")
    last_name = serializers.CharField(required=False, max_length=150, help_text="Фамилия пользователя")
    first_name = serializers.CharField(required=False, max_length=150, help_text="Имя пользователя")
    about = serializers.CharField(required=False, max_length=1000, help_text="О себе")
    sex = serializers.ChoiceField(choices=[
            ('М', 'Male'),
            ('Ж', "Female")
        ],
        help_text="Пол юзера. М - мужчина, Ж - женщина",
        required=False
    )
    company = serializers.CharField(max_length=255, required=False, help_text="Компания")
    passport = serializers.CharField(max_length=10, required=False, help_text="Паспорт")
    document = serializers.CharField(max_length=50, required=False, help_text="Какой-то документ. Будет удален")
    group = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), many=False, required=False,
                                               help_text="Группа пользователя")
    city = serializers.CharField(max_length=255, required=False, help_text="Город")
    birthday = serializers.DateField(required=False)
    description_for_change = serializers.CharField(max_length=255, required=False, help_text="Описание для заявки")
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    create_date = serializers.HiddenField(default=datetime.datetime.now())
    url = serializers.SerializerMethodField()
    answer_request = AnswerChangeProfileSerializer(read_only=True, many=True)

    def get_url(self, obj):
        return reverse('profilechangerequest-detail', kwargs={'pk': obj.pk}, request=self.context.get('request'))

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = UserSerializer((instance.user), context={"request": self.context.get('request')}).data
        representation['create_date'] = instance.create_date
        return representation

    def create(self, validated_data):
        self.delete_empty_requests()

        change_request = super().create(validated_data)
        return change_request

    def delete_empty_requests(self):
        profile = self.context['profile']
        empty_requests = ProfileChangeRequest.objects.filter(profile=profile,
                                                             answer_request__isnull=True)
        if empty_requests.exists():
            for empty_request in empty_requests:
                empty_request.delete()

class ChangeCategoryAndSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('category', 'skill')

    skill = serializers.PrimaryKeyRelatedField(queryset=Skill.objects.all(), many=True, required=False,
                                               help_text="Умения пользователя")
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True, required=False,
                                                  help_text="Интересующие категории")

class AccountReplenishmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountReplenishment
        fields = ['user', 'amount']

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    amount = serializers.FloatField()

    def validate(self, attrs):
        if attrs['amount'] <= 0:
            raise serializers.ValidationError("Неверно введенное значение")
        if attrs['amount'] > 350000:
            raise serializers.ValidationError("Внутреннее ограничение - не более 350 тыс. р.")
        return attrs

    def create(self, validated_data):
        replenish = super().create(validated_data)
        replenish.create_date = timezone.now()
        replenish.save()
        return replenish

    def update(self, instance, validated_data):
        instance.change_status_date = timezone.now()
        instance.save()
        return instance


class PayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payout
        fields = ['payout_token', 'user', 'amount']

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    amount = serializers.FloatField(required=True)
    payout_token = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['amount'] < 5:
            raise serializers.ValidationError("Сумма выплаты не может составлять меньше 5р")
        if attrs['amount'] > 500000:
            raise serializers.ValidationError("Сумма выплаты не может составлять свыше 500000р")
        if attrs['user'].money < attrs['amount']:
            raise serializers.ValidationError("На вашем балансе недостаточно средств для проведения выплаты")
        return attrs

    def create(self, validated_data):
        payout = make_payout_object(validated_data)
        return payout

    def update(self, instance, validated_data):
        instance.update_date = timezone.now()
        instance.save()
        return instance

