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
    ProfileConfirmAnswer
import datetime
from crowdfunding.settings import EMAIL_HOST_USER


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
        token = default_token_generator.make_token(user)
        reset_url = reverse('reset_password', args=[token])
        send_mail(
            'NAVOLNE. Изменение пароля',
            f'Для сброса пароля перейдите по этой ссылке: http://localhost:8000{reset_url}',
            EMAIL_HOST_USER,
            [user.email],
            fail_silently=False,
        )
        ResetPasswordToken.objects.create(user=user, token=token)
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

# class ProjectConfirmAnswerSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ProjectConfirmAnswer
#         fields = ['user', 'answer', 'confirmed', 'answer_time']
#
#     user = serializers.HiddenField(default=serializers.CurrentUserDefault())
#     answer = serializers.CharField(required=False, max_length=1000)
#     confirmed = serializers.BooleanField(required=True)
#     answer_time = serializers.DateTimeField(default=timezone.now())
#
#     def update_project(self, project):
#         project.confirmed = self.validated_data['confirmed']
#         project.save()

class AnswerChangeProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerProfileChangeRequest
        fields = (
            'admin', 'answer_description', 'confirmed', 'answer_date'
        )

    admin = serializers.HiddenField(default=serializers.CurrentUserDefault())
    answer_description = serializers.CharField(help_text="Ответ админа на заявку")
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
            'username', 'image', 'first_name', 'last_name', 'about', 'sex', 'company', 'passport',
            'document', 'group', 'city', 'description_for_change', 'user', 'create_date', 'url', 'answer_request'
        )

    username = serializers.CharField(required=False, max_length=255, validators=[
        UniqueValidator(queryset=ProfileChangeRequest.objects.all(),
                        message="Пользователь с таким username уже существует"),
        UniqueValidator(queryset=User.objects.all(), message="Пользователь с таким username уже существует"),
        RegexValidator()
    ], help_text="Юзернейм пользователя")
    image = serializers.ImageField(required=False, help_text="Изображение пользователя")
    last_name = serializers.CharField(required=False, max_length=150, help_text="Фамилия пользователя")
    first_name = serializers.CharField(required=False, max_length=150, help_text="Имя пользователя")
    about = serializers.CharField(required=False, max_length=1000, help_text="О себе")
    sex = serializers.CharField(max_length=1, required=False,
                                help_text="Пол пользователя. Передавать букву 'М' или 'Ж'")
    company = serializers.CharField(max_length=255, required=False, help_text="Компания")
    passport = serializers.CharField(max_length=10, required=False, help_text="Паспорт")
    document = serializers.CharField(max_length=50, required=False, help_text="Какой-то документ. Будет удален")
    group = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), many=False, required=False,
                                               help_text="Группа пользователя")
    city = serializers.CharField(max_length=255, required=False, help_text="Город")
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


class ChangeCategoryAndSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('category', 'skill')

    skill = serializers.PrimaryKeyRelatedField(queryset=Skill.objects.all(), many=True, required=False,
                                               help_text="Умения пользователя")
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True, required=False,
                                                  help_text="Интересующие категории")
