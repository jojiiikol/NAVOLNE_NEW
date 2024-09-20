from django.core.exceptions import ObjectDoesNotExist
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import status, viewsets, filters, mixins
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework.response import Response
from rest_framework.views import APIView

from .paginators import AllProjectsPaginator
from crow.serializers.project_serializer import *
from crow.serializers.profile_serializer import *
from crow.serializers.listings_serializer import *
from .permissions import get_project_view_permissions, \
    get_project_change_request_view_permissions, get_profile_view_permissions, \
    get_profile_change_request_view_permissions
from .utils import send_message_verification_email, check_token_timelife


# TODO: Пермишины - РАЗОБРАТЬСЯ С IsOwner, ПОЛЯ ЮЗЕР/ПРОФИЛЬ, ЛИБО САМ ОБЪЕКТ
# TODO: Пермишины - протестить, поменять доку
# TODO: Показать как показываюстя проекты у владельца и не у владельца в профиле
# TODO: Пермишины для неподтвержденных юзеров/проектов
# TODO: Просмотреть валидаторы на изменение профиля
# TODO: Система просмотров

class ProjectViewSet(mixins.ListModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.CreateModelMixin,
                     viewsets.GenericViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name']
    filterset_fields = ['category']
    lookup_field = 'slug'
    pagination_class = AllProjectsPaginator

    def get_permissions(self):
        return get_project_view_permissions(self)


    # Просмотр подтвержденных проектов
    @extend_schema(
        summary="Вывод всех подтвержденных админом проектов",
        description="Метод имеет фильтры с помощью которого проекты можно находить по категориям/названиям"
    )
    def list(self, request, *args, **kwargs):
        self.queryset = Project.objects.filter(confirmed=True)
        return super().list(request, *args, **kwargs)

    # Создание проекта
    @extend_schema(summary="Создание проекта",
                   request=ProjectSerializerCreate,
                   description="Данные отправляются в MultiPart\nДля создания проекта нужно быть авторизированным")
    def create(self, request, *args, **kwargs):
        self.parser_classes = [MultiPartParser, FormParser]
        self.serializer_class = ProjectSerializerCreate
        return super().create(request, *args, **kwargs)

    # Оплата проекта
    @extend_schema(summary="Псевдооплата проекта",
                   request=PaymentSerializer)
    @action(methods=['POST'], detail=True)
    def payment(self, request, *args, **kwargs):
        self.serializer_class = PaymentSerializer
        serializer_data = self.serializer_class(data=request.data, context={'request': request})
        if serializer_data.is_valid():
            serializer_data.save(project=self.get_object())
            return Response({"data": "Транзакция проведена"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer_data.errors, status=status.HTTP_400_BAD_REQUEST)

    # Поддать заявку на изменение
    @extend_schema(summary="Создание заявки на изменение проекта",
                   request=ChangeProjectRequestSerializer,
                   description="Данные отправляются в MultiPart."
                               "Поля необязательные - то есть можно передавать их "
                               "пустыми, если юзер не захочет их менять")
    @action(methods=['POST'], detail=True)
    def change_request(self, request, *args, **kwargs):
        self.parser_classes = [MultiPartParser, FormParser]
        self.serializer_class = ChangeProjectRequestSerializer
        serializer_data = self.serializer_class(data=request.data,
                                                context={'request': request, 'project': self.get_object()})
        if serializer_data.is_valid():
            serializer_data.save(project=self.get_object())
            return Response(serializer_data.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer_data.errors, status=status.HTTP_400_BAD_REQUEST)

    # Показать неподтвержденные проекты
    @extend_schema(summary="Показать неподтвержденные проекты ---не доделано---",
                   description="Необходимо для админов, которые будут подтверждать/отклонять новые проекты")
    @action(methods=['GET'], detail=False)
    def not_confirmed_projects(self, request, *args, **kwargs):
        projects = Project.objects.filter(confirmed=False)
        serializer_data = ProjectSerializer(projects, many=True, context={'request': request})
        return Response({"project": serializer_data.data}, status=status.HTTP_200_OK)

    # Подтверждение проекта
    @extend_schema(summary="Подтверждение проекта",
                   description="Необходимо для админов. Подтверждение/отклонение новых проектов",
                   request=ProjectConfirmSerializer,
                   )
    @action(methods=['POST'], detail=True)
    def confirm_project(self, request, *args, **kwargs):
        project = self.get_object()
        serializer = ProjectConfirmSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.update_project(project=project)
            serializer.save(project=project)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(summary="Просмотр ответа админов на подтверждение/отклонение проекта",
                   description="Необходимо для юзеров, для того чтобы посмотреть на ответ админа на свой новый проект",
                   )
    @action(methods=['GET'], detail=True)
    def see_confirm_status(self, request, *args, **kwargs):
        project = self.get_object()
        answer = ProjectConfirmAnswer.objects.filter(project=project).order_by('-answer_time')
        serializer = ProjectConfirmSerializer(answer, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProjectChangeRequestViewSet(mixins.ListModelMixin,
                                  mixins.RetrieveModelMixin,
                                  mixins.DestroyModelMixin,
                                  mixins.UpdateModelMixin,
                                  viewsets.GenericViewSet):
    queryset = ProjectChangeRequest.objects.all()
    serializer_class = ChangeProjectRequestSerializer

    # filter_backends = [DjangoFilterBackend]
    # filterset_fields = ['confirmed', ]

    def get_permissions(self):
        return get_project_change_request_view_permissions(self)

    @extend_schema(summary="Показать заявки на изменение проектов")
    # Покащать список заявок на изменение проекта
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(summary="Удаление заявки на изменение проекта",
                   description="Удаление возможно только в том случае, если он не содержит ответов от администратора")
    def destroy(self, request, *args, **kwargs):
        try:
            AnswerProjectChangeRequest.objects.get(change_request=self.get_object())
        except ObjectDoesNotExist:
            return super().destroy(request, *args, **kwargs)
        return Response({"data": "Нельзя удалить этот объект, так как он содержит ответы от администраторов"},
                        status=status.HTTP_200_OK)

    # Подтвердить/отклонить изменение проекта. При подтверждении перезаписывается запись проекта
    @extend_schema(summary="Метод для подтверждения/отклонения изменения проектов",
                   request=AnswerChangeProjectRequestSerializer)
    def update(self, request, *args, **kwargs):
        serializer = AnswerChangeProjectRequestSerializer
        serializer_data = serializer(data=request.data, context={'request': request})
        if serializer_data.is_valid():
            serializer_data.save(change_request=self.get_object())
            if serializer_data['confirmed'].value:
                serializer_data.update_project(self.get_object())
            return Response(serializer_data.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer_data.errors, status=status.HTTP_400_BAD_REQUEST)

    # Показать все свои (по юзеру) заявки на изменения
    @extend_schema(summary="Эндпоинт для отслеживания заявок создателями")
    @action(methods=['GET'], detail=False)
    def show_request(self, request, *args, **kwargs):
        self.queryset = ProjectChangeRequest.objects.filter(user=request.user)
        serializer = ChangeProjectRequestSerializer(self.queryset, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="Просмотр ответа админов на твою заявку",
                   description="Необходимо для юзеров, для того чтобы посмотреть на ответ админа на свою заявку",
                   )
    @action(methods=['GET'], detail=True)
    def see_admin_response(self, request, *args, **kwargs):
        change_request = self.get_object()
        answer = AnswerProjectChangeRequest.objects.filter(change_request=change_request).order_by('-answer_date')
        serializer = AnswerChangeProjectRequestSerializer(answer, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProfileViewSet(mixins.ListModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.CreateModelMixin,
                     viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'

    def get_permissions(self):
        return get_profile_view_permissions(self)

    @extend_schema(summary="Список всех юзеров")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(summary="Просмотр профиля юзера",
                   description="Вся информация о профиле доступна только админу и владельцу")
    def retrieve(self, request, *args, **kwargs):
        if (self.get_object() == self.request.user) or (self.request.user.is_staff):
            self.serializer_class = AdditionalUserSerializerForOwner
        else:
            self.serializer_class = AdditionalUserSerializerForOther
        print(self.request.user)
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(summary="Регистрация",
                   request=RegistrationSerializer)
    def create(self, request, *args, **kwargs):
        self.serializer_class = RegistrationSerializer
        return super().create(request, *args, **kwargs)

    @extend_schema(summary="Изменение своих скиллов и категорий юзером",
                   description="Юзер сам может менять свои скиллы и необходимые категории для него",
                   request=ChangeCategoryAndSkillSerializer)
    def partial_update(self, request, *args, **kwargs):
        self.serializer_class = ChangeCategoryAndSkillSerializer
        data = self.serializer_class(self.get_object(), data=request.data, context={'request': request})
        if data.is_valid():
            data.save()
            return Response(data.data, status=status.HTTP_200_OK)
        return Response(data.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(summary="Эндпоинт для сброса пароля",
                   description="В случае, если юзер забыл пароль, то на введенную им почту приходит сообщение для "
                               "сброса пароля. Письмо содержит ссылку с уникальным токеном",
                   request=EmailForResetPasswordSerializer)
    @action(methods=['POST'], detail=False)
    def get_message_reset_password(self, request, *args, **kwargs):
        self.serializer_class = EmailForResetPasswordSerializer
        data = self.serializer_class(data=request.data, context={'request': request})
        if data.is_valid():
            data.save()
            return Response(data={"Письмо со сбросом пароля было успешно отправлено"}, status=status.HTTP_200_OK)
        return Response(data=data.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(summary="Эндпоинт для подтверждения почты",
                   description="В случае, если юзер забыл подтвердить почту при регистрации, то ему на почту приходит сообщение для "
                               "подтверждения. Письмо содержит ссылку с уникальным токеном. Если человек уже "
                               "подтвердил свою почту, но снова решит это сделать, то система предупредит его о том, "
                               "что его почта уже подтверждена")
    @action(methods=['GET'], detail=False)
    def get_email_verification_message(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated:
            if user.email_verified:
                return Response(data={"Ваша почта уже активирована"}, status=status.HTTP_200_OK)
            send_message_verification_email(user)
            return Response(data={"На вашу почту была отправлена ссылка на подтверждение"}, status=status.HTTP_200_OK)
        return Response(data={"Вы не авторизированы"}, status=status.HTTP_200_OK)

    @extend_schema(summary="Создание заявки на изменение профиля",
                   description="Создание заявки, которая будет отсмотрена и подтверждена/отклонена админом. Поля "
                               "необязательны - юзер заполняет то, что он хочет поменять в своем профиле",
                   request=ChangeProfileRequestSerializer)
    @action(methods=['POST'], detail=True)
    def change(self, request, *args, **kwargs):
        self.parser_classes = [MultiPartParser, FormParser]
        self.serializer_class = ChangeProfileRequestSerializer
        serializer_data = self.serializer_class(data=request.data, context={'request': request})
        if serializer_data.is_valid():
            serializer_data.save(profile=self.get_object())
            return Response(serializer_data.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer_data.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(summary="Показать неподтвержденных юзеров",
                   description="Для админов")
    @action(methods=['GET'], detail=False)
    def not_confirmed_users(self, request, *args, **kwargs):
        users = User.objects.filter(confirmed=False)
        serializer_data = UserSerializer(users, many=True, context={'request': request})
        return Response({"user": serializer_data.data}, status=status.HTTP_200_OK)

    @extend_schema(summary="Подтвердить юзера",
                   description="Админы подтверждают/отклоняют новых юзеров",
                   request=ConfirmUserSerializer)
    @action(methods=['PATCH'], detail=True)
    def confirm_user(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = ConfirmUserSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(profile=user)
            serializer.update_profile(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(summary="Просмотреть ответы админов на подтверждение своего акквунта",
                   description="Юзеры с помощью этого эндпоинта могут посмотреть ответы админов на подтверждение профиля",
                   request=ConfirmUserSerializer)
    @action(methods=['GET'], detail=True)
    def see_confirm_status(self, request, *args, **kwargs):
        profile = self.get_object()
        answer = ProfileConfirmAnswer.objects.filter(profile=profile).order_by('-answer_time')
        serializer = ProjectConfirmSerializer(answer, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class EmailVerification(APIView):
    @extend_schema(summary="Эндпоинт подтверждения почты",
                   description="При переходе на ссылку с почты - подтверждается почта")
    def get(self, request, token, *args, **kwargs):
        try:
            db_token = VerificationToken.objects.get(token=token)
            user = db_token.user
            user.email_verified = True
            user.save()
            db_token.delete()
            return Response(data={"Email был активирован"}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(data={"Токен не найден"}, status=status.HTTP_400_BAD_REQUEST)


# Смена пароля по ссылке
class ResetPassword(APIView):
    @extend_schema(summary="Эндпоинт сброса пароля",
                   description="Тут юзер должен придумать новый пароль",
                   request=ResetPasswordSerializer)
    def post(self, request, token, *args, **kwargs):
        token_db = ResetPasswordToken.objects.get(token=token)
        check_token_timelife(token_db)
        user = token_db.user
        data = ResetPasswordSerializer(user, data=request.data, context={'request': request})
        if data.is_valid():
            data.save()
            token_db.delete()
            return Response(data={"Пароль был успешно изменен"}, status=status.HTTP_200_OK)
        else:
            return Response(data=data.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileChangeRequestViewSet(mixins.ListModelMixin,
                                  mixins.RetrieveModelMixin,
                                  mixins.DestroyModelMixin,
                                  viewsets.GenericViewSet):
    queryset = ProfileChangeRequest.objects.all()
    serializer_class = ChangeProfileRequestSerializer

    def get_permissions(self):
        return get_profile_change_request_view_permissions(self)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @extend_schema(summary="Показать все заявки на изменение профиля")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(summary="Удаление заявки на изменение профиля",
                   description="Удаление возможно только в том случае, если он не содержит ответов от администратора")
    def destroy(self, request, *args, **kwargs):
        try:
            AnswerProjectChangeRequest.objects.get(change_request=self.get_object())
        except ObjectDoesNotExist:
            return super().destroy(request, *args, **kwargs)
        return Response({"data": "Нельзя удалить этот объект, так как он содержит ответы от администраторов"},
                        status=status.HTTP_200_OK)

    @extend_schema(summary="Посмотреть заявку на изменение профиля")
    def retrieve(self, request, *args, **kwargs):
        print("fdsf")
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(summary="Ответ на заявку изменения профиля юзера",
                   description="Для админов",
                   request=AnswerChangeProfileSerializer)
    @action(methods=['POST'], detail=True)
    def answer(self, request, *args, **kwargs):
        profile_request = self.get_object()
        serializer_data = AnswerChangeProfileSerializer(data=request.data, context={'request': request})
        if serializer_data.is_valid():
            serializer_data.save(profile=profile_request)
            if serializer_data['confirmed'].value:
                serializer_data.update_profile(profile_request.profile, profile_request)
            return Response(serializer_data.data, status=status.HTTP_200_OK)
        return Response(serializer_data.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(summary="Просмотр ответа админов на твою заявку",
                   description="Необходимо для юзеров, для того чтобы посмотреть на ответ админа на свою заявку",
                   )
    @action(methods=['GET'], detail=True)
    def see_admin_response(self, request, *args, **kwargs):
        change_request = self.get_object()
        answer = AnswerProfileChangeRequest.objects.filter(profile=change_request).order_by('-answer_date')
        serializer = AnswerChangeProfileSerializer(answer, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['GET'], detail=False)
    def show_requests(self, request, *args, **kwargs):
        requests = ProfileChangeRequest.objects.filter(profile=request.user)
        serializers = ChangeProfileRequestSerializer(requests, many=True, context={'request': request})
        return Response(serializers.data, status=status.HTTP_200_OK)


# Служебное вью для просмотра id всех категорий
class AdditionalTag(APIView):
    @extend_schema(summary="Сервисный эндпоинт для получения доп. информации",
                   description="Для Владика Бобова. Тут ты получишь все ключи на категории, скиллы, группы")
    def get(self, request):
        try:
            category = Category.objects.all()
            skills = Skill.objects.all()
            group = Group.objects.all()
            serializer_group = GroupSerializerForAdditionalView(group, many=True)
            serializer_skill = SkillSerializer(skills, many=True)
            serializer_category = CategorySerializer(category, many=True)
            data = {
                "groups": serializer_group.data,
                "skills": serializer_skill.data,
                "category": serializer_category.data
            }
            return Response(data)
        except:
            return Response({'error': "Произошла ошибка"}, status=status.HTTP_418_IM_A_TEAPOT)
