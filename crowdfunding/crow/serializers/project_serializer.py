import datetime

from django.contrib.auth.models import Group
from django.contrib.auth.password_validation import validate_password
from django.core.validators import RegexValidator
from django.db import transaction
from django.utils import timezone
from pytils.translit import slugify
from rest_framework import serializers
from rest_framework.reverse import reverse
from rest_framework.validators import UniqueValidator

from crow.models import Project, Category, Transaction, ProjectChangeRequest, User, AnswerProjectChangeRequest, \
    ProjectConfirmAnswer, ProjectImages, \
    NewImageToProject, ProjectStatusCode, ProjectClosureRequest, CashingOutProject, Payout
from crow.serializers.listings_serializer import CategoryListing, SkillListing, GroupSerializerForAdditionalView, \
    ProjectStatusCodeSerializer
from crow.serializers.profile_serializer import UserSerializer
from crow.tasks import send_message_verification_email
from crow.transactions import make_payout_object
from crow.utils import result_amount_with_commission
from crow.validators import SpecialCharactersValidator, OnlyTextValidator, ProjectNameValidator


class ProjectImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImages
        fields = ('pk', 'image',)


class ProjectSerializer(serializers.ModelSerializer):
    category = CategoryListing(many=True)
    user = UserSerializer(read_only=True)
    slug = serializers.CharField(read_only=True)
    need_money = serializers.FloatField(read_only=True)
    collected_money = serializers.FloatField(read_only=True)
    image = serializers.ImageField()
    project_images = ProjectImagesSerializer(many=True)
    payment_url = serializers.SerializerMethodField()
    start_date = serializers.DateField(read_only=True)
    end_date = serializers.DateField(read_only=True)
    confirmed = serializers.BooleanField(read_only=True)
    url = serializers.SerializerMethodField()
    change_url = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    is_admin = serializers.SerializerMethodField()
    confirm_url = serializers.SerializerMethodField()
    status_code = ProjectStatusCodeSerializer(read_only=True)

    class Meta:
        model = Project
        fields = (
            'pk', 'slug', 'user', 'name', 'small_description', 'description', 'slug', 'need_money', 'collected_money',
            'start_date',
            'end_date', 'category', 'image', 'project_images', 'confirmed', 'url', 'payment_url', 'change_url',
            'is_owner', 'is_admin', 'confirm_url', 'transfer_allowed', 'closure_type', 'status_code', 'views')

    def get_is_owner(self, obj):
        if obj.user.username == self.context.get('request').user.username:
            return True

    def get_is_admin(self, obj):
        if self.context.get('request').user.is_superuser:
            return True

    def get_payment_url(self, obj):
        return reverse('project-payment', kwargs={'slug': obj.slug}, request=self.context['request'])

    def get_url(self, obj):
        return reverse('project-detail', kwargs={'slug': obj.slug}, request=self.context['request'])

    def get_change_url(self, obj):
        return reverse('project-change-request', kwargs={'slug': obj.slug}, request=self.context['request'])

    def get_confirm_url(self, obj):
        return reverse('project-confirm-project', kwargs={'slug': obj.slug}, request=self.context['request'])

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if (self.context['request'].user.is_superuser is False) and (self.context['request'].user != instance.user):
            representation.pop('transfer_allowed')
        representation['views'] = instance.views.count()
        return representation


class ProjectSerializerCreate(serializers.ModelSerializer):
    name = serializers.CharField(
        validators=[
            UniqueValidator(queryset=Project.objects.all(), message="Проект с таким названием уже существует"),
            ProjectNameValidator(),
        ],
        max_length=27, required=True, help_text="Название проекта")
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    small_description = serializers.CharField(max_length=40, required=True,
                                              help_text="Малое описание проекта. Максимум - 40 символов")
    description = serializers.CharField(max_length=1000, required=True,
                                        help_text="Описание проекта. Максимум - 1000 символов")
    need_money = serializers.FloatField(required=True, help_text="Необходимая сумма сбора")
    collected_money = serializers.FloatField(required=True, help_text="Собранная сумма")
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True,
                                                  help_text="Категории проекта")
    start_date = serializers.DateField(default=timezone.now(),
                                       help_text="Дата начала проекта. По умолчанию - сегодняшняя дата")
    end_date = serializers.DateField(help_text="Дата окончания сборов на проект")
    project_images = ProjectImagesSerializer(many=True, required=False)
    closure_type = serializers.ChoiceField(
        choices=[
            ('BY_AMOUNT', 'Closing of fundraising'),
            ('BY_TIME', "Closing after time expires")
        ],
        help_text="Тип закрытия проекта. BY_AMOUNT - закрытие сбора по определенной сумме, BY_TIME - закрытие сбора по истечении времени",
        required=True
    )

    class Meta:
        model = Project
        fields = (
            'user', 'name', 'image', 'small_description', 'description', 'need_money', 'collected_money', 'category',
            'project_images', 'start_date', 'end_date', 'closure_type')

    def validate_start_date(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError("Неверно введенная дата")
        return value

    def validate_need_money(self, value):
        if value < 1:
            raise serializers.ValidationError("Неверно введенные данные")
        return value

    def validate_collected_money(self, value):
        if value < 0:
            raise serializers.ValidationError("Неверное введенные данные")
        return value

    def validate(self, attrs):
        if attrs['start_date'] >= attrs['end_date']:
            raise serializers.ValidationError({"end_date": "Дата окончания не может быть раннее даты старта проекта"})
        if attrs['need_money'] < attrs['collected_money']:
            raise serializers.ValidationError({"need_money": "Собранная сумма превышает необходимую"})
        return attrs

    def create(self, validated_data):
        images = validated_data.pop('project_images', [])
        validated_data['name'] = validated_data['name'].lower().capitalize()
        validated_data['status_code'] = ProjectStatusCode.objects.get(code=0)
        project = super().create(validated_data)
        for image in images:
            ProjectImages.objects.create(project=project, image=image['image'])
        return project


class ProjectConfirmSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectConfirmAnswer
        fields = ['user', 'answer', 'confirmed', 'answer_time']

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    answer = serializers.CharField(required=False, max_length=1000)
    confirmed = serializers.BooleanField(required=True)
    answer_time = serializers.DateTimeField(default=timezone.now())

    def update_project(self, project):
        project.confirmed = self.validated_data['confirmed']
        if project.confirmed:
            project.set_inwork_status()
        project.save()
    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)
    #     representation['project'] = ProjectSerializer((instance.project), context={"request": self.context.get('request')}).data
    #     return representation


class ConfirmProjectSerializer(serializers.ModelSerializer):
    confirmed = serializers.BooleanField(required=True)

    class Meta:
        model = Project
        fields = ['confirmed']

    def update(self, instance, validated_data):
        instance.confirmed = validated_data.get('confirmed', instance.confirmed)
        instance.save()
        return instance


class ProjectClosureRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectClosureRequest
        fields = ('date',)

    date = serializers.DateTimeField(default=timezone.now())


class AnswerProjectClosureRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectClosureRequest
        fields = ['admin', 'description', 'allowed', 'answer_date', 'url']

    admin = serializers.HiddenField(default=serializers.CurrentUserDefault())
    description = serializers.CharField(required=False, max_length=1000)
    allowed = serializers.BooleanField(required=True)
    answer_date = serializers.DateTimeField(default=timezone.now())
    url = serializers.SerializerMethodField()

    def get_url(self, obj):
        return reverse('projectclosurerequest-detail', kwargs={'pk': obj.pk}, request=self.context['request'])

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['project'] = ProjectSerializer(instance.project,
                                                      context={"request": self.context.get('request')}).data
        representation['admin'] = UserSerializer(instance.admin, context={"request": self.context.get('request')}).data
        return representation

    def update(self, instance, validated_data):
        super().update(instance, validated_data)
        request = instance
        project = request.project
        if validated_data['allowed'] is True:
            project.set_finish_status()
        else:
            project.set_inwork_status()
        project.save()
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



class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('user', 'money')

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    money = serializers.FloatField()

    def validate_money(self, values):
        if values < 0:
            raise serializers.ValidationError('Значение не может быть отрицательным')
        return values

    def validate(self, attrs):
        if attrs['user'].money < attrs['money']:
            raise serializers.ValidationError({"data": 'На вашем балансе не хватает средств'})
        return attrs

    def create(self, validated_data):
        user = validated_data['user']
        user.money -= validated_data['money']
        user.save()

        project = validated_data['project']
        project.collected_money += validated_data['money']
        project.save()
        return Transaction.objects.create(**validated_data)


class AnswerChangeProjectRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerProjectChangeRequest
        fields = (
            'admin', 'answer_description', 'confirmed', 'answer_date'
        )

    admin = serializers.HiddenField(default=serializers.CurrentUserDefault())
    answer_description = serializers.CharField(help_text="Ответ админа на заявку")
    confirmed = serializers.BooleanField(required=True,
                                         help_text="true/false. В случае передачи true - в проект вносятся изменения")
    answer_date = serializers.DateTimeField(required=False, default=timezone.now(),
                                            help_text="Необязательное поле. Заполняется автоматически")

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['admin'] = UserSerializer((instance.admin),
                                                 context={"request": self.context.get('request')}).data
        return representation

    def update_project(self, change_request):
        project = change_request.project
        project.name = change_request.name or project.name
        project.small_description = change_request.small_description or project.small_description
        project.description = change_request.description or project.description
        project.need_money = change_request.need_money or project.need_money
        project.end_date = change_request.end_date or project.end_date
        if change_request.category:
            project.category.clear()
            project.category.set([category for category in (change_request.category.all())])
        project.image = change_request.image or project.image
        if change_request.name:
            slug = slugify(change_request.name)
            project.slug = slug
        [ProjectImages.objects.create(project=project, image=image.image) for image in
         NewImageToProject.objects.filter(project_change_request=change_request)]
        project.save()
        return project


class NewImageToProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewImageToProject
        fields = ['pk', 'image']


class ChangeProjectRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectChangeRequest
        fields = ('pk', 'name', 'small_description', 'description', 'need_money',
                  'end_date', 'category', 'image', 'add_image', 'description_for_change', 'user', 'create_date',
                  'answer_change_requests_project',
                  'project_url', 'url')

    name = serializers.CharField(required=False,
                                 validators=[
                                     UniqueValidator(queryset=Project.objects.all(), message="Это имя уже занято"),
                                     UniqueValidator(queryset=ProjectChangeRequest.objects.all())],
                                 max_length=27, help_text="Название проекта")
    small_description = serializers.CharField(required=False, max_length=40,
                                              help_text="Малое описание проекта. Максимум - 40 символов")
    description = serializers.CharField(required=False, max_length=1000,
                                        help_text="Описание проекта. Максимум - 1000 символов")
    need_money = serializers.FloatField(required=False, help_text="Необходимая сумма сбора")
    end_date = serializers.DateField(required=False, help_text="Дата окончания")
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True, required=False,
                                                  help_text="Категории проекта")
    image = serializers.ImageField(required=False, default="")
    add_image = NewImageToProjectSerializer(required=False, many=True)
    description_for_change = serializers.CharField(required=False, max_length=2048,
                                                   help_text="Ответ от админа на заявку")
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    create_date = serializers.HiddenField(default=datetime.datetime.now())
    answer_change_requests_project = AnswerChangeProjectRequestSerializer(many=True, read_only=True)
    project_url = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    def validate_need_money(self, attrs):
        if self.context['project'].collected_money >= attrs:
            raise serializers.ValidationError("Необходимая сумма средств меньше или равна собранной сумме")
        return attrs

    def validate_end_date(self, attrs):
        if self.context['project'].start_date >= attrs['end_date']:
            raise serializers.ValidationError({"end_date": "Дата окончания не может быть раннее даты старта проекта"})
        return attrs

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = UserSerializer((instance.user), context={"request": self.context.get('request')}).data
        representation['create_date'] = instance.create_date
        representation['slug'] = instance.project.slug
        return representation

    def get_project_url(self, obj):
        return reverse('project-detail', kwargs={'slug': obj.project.slug}, request=self.context.get('request'))

    def get_url(self, obj):
        return reverse('projectchangerequest-detail', kwargs={'pk': obj.pk}, request=self.context.get('request'))

    def create(self, validated_data):
        new_images = validated_data.pop('add_image', [])
        if validated_data.get('name'):
            validated_data['name'] = validated_data['name'].lower().capitalize()
        change_request = super().create(validated_data)
        if new_images:
            for image in new_images:
                NewImageToProject.objects.create(project_change_request=change_request, image=image['image'])
        return change_request


class AdditionalUserSerializerForOwner(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'username', 'image', 'first_name', 'last_name', 'birthday', 'about', 'skill', 'sex', 'company', 'passport',
            'document', 'money', 'total_money_sent', 'city', 'confirmed', 'category', 'date_joined', 'projects',
            'groups',
            'email_verified', 'is_owner', 'is_admin')

    username = serializers.CharField(read_only=True)
    image = serializers.ImageField(required=False)
    money = serializers.IntegerField(read_only=True)
    total_money_sent = serializers.FloatField(read_only=True)
    date_joined = serializers.DateTimeField(read_only=True, format='%d.%m.%Y')
    projects = ProjectSerializer(read_only=True, many=True)
    confirmed = serializers.BooleanField(read_only=True)
    skill = SkillListing(many=True, required=False)
    category = CategoryListing(many=True, required=False)
    groups = GroupSerializerForAdditionalView(many=True, required=False)
    sex = serializers.CharField(max_length=1, required=False)
    email_verified = serializers.BooleanField(read_only=True)
    is_owner = serializers.SerializerMethodField()
    is_admin = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        if self.context.get('request').user.username == obj.username:
            return True
        return False

    def get_is_admin(self, obj):
        if obj.is_superuser or obj.is_staff:
            return True
        return False

    def validate_sex(self, values):
        if values not in ['М', 'Ж']:
            raise serializers.ValidationError("Введено неверное значение")

    def validate_first_name(self, value):
        if not value.isalpha():
            raise serializers.ValidationError("В имени не может быть цифр")
        return value.capitalize()

    def validate_last_name(self, value):
        if not value.isalpha():
            raise serializers.ValidationError("В фамилии не может быть цифр")
        return value.capitalize()

    def validate_passport(self, value):
        if (value.isdigit() != True) or (len(value) != 10):
            raise serializers.ValidationError("Неверный формат паспорта")
        return value

    def validate_birthday(self, value):
        if value >= datetime.date.today():
            raise serializers.ValidationError("Неверно указана дата рождения")
        return value

    def update(self, instance, validated_data):
        instance.confirmed = False
        return super().update(instance, validated_data)


class AdditionalUserSerializerForOther(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'image', 'about', 'birthday', 'last_name', 'sex', 'company', 'document',
                  'total_money_sent', 'projects', 'category', 'skill', 'date_joined', 'groups', 'city', 'confirmed')

    category = serializers.StringRelatedField(many=True)
    image = serializers.ImageField()
    projects = ProjectSerializer(many=True, read_only=True)
    skill = serializers.StringRelatedField(many=True)
    groups = GroupSerializerForAdditionalView(many=True, required=False)
    date_joined = serializers.DateTimeField(format='%d.%m.%Y', read_only=True)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        projects = Project.objects.filter(user=instance, confirmed=True)
        print(projects)
        representation['projects'] = ProjectSerializer(projects, many=True,
                                                       context={'request': self.context.get('request')}).data
        return representation


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'last_name', 'first_name', 'email', 'password_1', 'password_2', 'groups')

    username = serializers.CharField(required=True, max_length=255, validators=[
        UniqueValidator(queryset=User.objects.all(), message="Пользователь с таким username уже зарегистрирован"),
        RegexValidator(),
        SpecialCharactersValidator()
    ], help_text="Юзернейм пользователя")
    email = serializers.EmailField(required=True, validators=[
        UniqueValidator(queryset=User.objects.all(), message="Пользователь с таким email уже зарегистрирован")],
                                   help_text="Электронная почта пользователя")
    password_1 = serializers.CharField(write_only=True, required=True, validators=[validate_password],
                                       help_text="Пароль")
    password_2 = serializers.CharField(write_only=True, required=True, help_text="Повтор пароля")
    last_name = serializers.CharField(required=True, max_length=150, help_text="Фамилия", validators=[
        OnlyTextValidator()
    ])
    first_name = serializers.CharField(required=True, max_length=150, help_text="Имя", validators=[
        OnlyTextValidator()
    ])
    groups = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), many=True, help_text="Группа")

    def validate_groups(self, values):
        if len(values) == 0:
            raise serializers.ValidationError('Выберите группу')
        return values

    def validate(self, attrs):
        if attrs['password_1'] != attrs['password_2']:
            raise serializers.ValidationError({'password': 'Пароли не совпадают'})
        return attrs

    def create(self, validated_data):

        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            last_name=validated_data['last_name'].lower().capitalize(),
            first_name=validated_data['first_name'].lower().capitalize(),
        )
        user.set_password(validated_data['password_1'])
        [group.user_set.add(user) for group in validated_data['groups']]
        user.save()

        try:
            send_message_verification_email.delay_on_commit(user.pk)
        except:
            pass

        return user
