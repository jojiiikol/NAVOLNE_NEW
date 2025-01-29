from django.core.exceptions import ObjectDoesNotExist
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import status, viewsets, filters, mixins
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework.response import Response
from rest_framework.views import APIView

from .models import VerificationToken, IP
from .paginators import AllProjectsPaginator
from crow.serializers.project_serializer import *
from crow.serializers.profile_serializer import *
from crow.serializers.listings_serializer import *
from .payment import create_payment
from .permissions import get_project_view_permissions, \
    get_project_change_request_view_permissions, get_profile_view_permissions, \
    get_profile_change_request_view_permissions, get_closure_request_view_permissions
from .transactions import cash_out_project
from .utils import check_token_timelife, change_transfer_status, get_client_ip, get_commission_rate, save_ip_view
from .tasks import send_message_verification_email


# TODO: -------- ГЛАВНОЕ СЕЙЧАС ---------------
# TODO: 1) Вывод средств с проекта ----> Куда отправлять коммиссию?
# TODO: 3) Разобраться с cors для просмотра по фильтрам
# TODO: -----------------------------------------------

# TODO: -------- Доп логика ---------------
# TODO: 2) Вывод проектов по интересам пользователя
# TODO: -----------------------------------------------

# TODO: Разобраться как не подключаться к redis, если нет подключения


# TODO: Отрефачить логику попытки удаления заявки на изменения при ответе админа, перенести в пермишины
# TODO: Пересоздать миграции



# TODO: ----------ДЕПЛОЙ----------
# TODO: Настроить SOCKET_TIMEOUT
# TODO: Настроить логгирование SENTRY
# TODO: Разобраться с workers gunicorn
# TODO: Разобраться с SSL сертификатом


class ProjectViewSet(mixins.ListModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.CreateModelMixin,
                     viewsets.GenericViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    search_fields = ['name']
    filterset_fields = ['category', 'status_code']
    ordering_fields = ['collected_money', 'views']
    lookup_field = 'slug'
    pagination_class = AllProjectsPaginator

    def get_permissions(self):
        return get_project_view_permissions(self)

    @method_decorator(cache_page(60 * 30, key_prefix='project_page'))
    def retrieve(self, request, *args, **kwargs):
        project = self.get_object()
        save_ip_view(request, project)
        return super().retrieve(request, *args, **kwargs)

    # Просмотр подтвержденных проектов
    @extend_schema(
        summary="Вывод всех подтвержденных проектов",
        description="Метод имеет фильтры с помощью которого проекты можно находить по категориям/названиям. Доступно всем"
    )
    @method_decorator(cache_page(60 * 3, key_prefix='all_projects_page'))
    def list(self, request, *args, **kwargs):
        self.queryset = Project.objects.exclude(status_code=ProjectStatusCode.objects.get(code=0))
        return super().list(request, *args, **kwargs)

    # Создание проекта
    @extend_schema(summary="Создание проекта",
                   request=ProjectSerializerCreate,
                   description="Данные отправляются в MultiPart\nДля создания проекта нужно быть авторизированным и подтвержденным")
    def create(self, request, *args, **kwargs):
        self.parser_classes = [MultiPartParser, FormParser]
        print(self.request.data)
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
            change_transfer_status(project=self.get_object())
            return Response({"data": "Транзакция проведена"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer_data.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['POST'], detail=False)
    def test_payment(self, request, *args, **kwargs):
        data = request.data
        self.serializer_class = AccountReplenishmentSerializer(data=data, context={'request': request})
        if self.serializer_class.is_valid():
            amount = self.serializer_class.validated_data['amount']
            user = request.user
            payment, idempotence_key = create_payment(value=amount, user=user)
            self.serializer_class.save(idempotence_key=idempotence_key)
            return Response({"data": payment}, status=status.HTTP_200_OK)
        return Response(self.serializer_class.errors, status=status.HTTP_400_BAD_REQUEST)

    # Поддать заявку на изменение
    @extend_schema(summary="Создание заявки на изменение проекта",
                   request=ChangeProjectRequestSerializer,
                   description="Данные отправляются в MultiPart."
                               "Поля необязательные - то есть можно передавать их "
                               "пустыми, если юзер не захочет их менять. Доступ только у админа и у создателя проекта")
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
    @extend_schema(summary="Показать все неподтвержденные проекты",
                   description="Необходимо для админов, которые будут подтверждать/отклонять новые проекты. Только админ")
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
                   description="Необходимо для юзеров, для того чтобы посмотреть на ответ админа на свой новый "
                               "проект. Доступ у создателя проекта",
                   )
    @action(methods=['GET'], detail=True)
    def see_confirm_status(self, request, *args, **kwargs):
        project = self.get_object()
        answer = ProjectConfirmAnswer.objects.filter(project=project).order_by('-answer_time')
        serializer = ProjectConfirmSerializer(answer, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="Удаление картинки с проекта",
                   description="Для работы необходимо отправить в юрл слаг проекта и номер картинки. Доступ у создателя проекта",
                   )
    @action(methods=['DELETE'], detail=True, url_path='remove-image/(?P<image_id>[^/.]+)')
    def remove_image(self, request, image_id, *args, **kwargs):
        print(self.get_object())
        try:
            print(image_id)
            image = ProjectImages.objects.get(id=image_id, project=self.get_object())
            image.delete()
            return Response(status=status.HTTP_200_OK, data={'message': "Изображение было удалено"})
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND, data={'message': "Изображение не было найдено"})

    @extend_schema(summary="Отправка заявки на закрытие сбора",
                   description="Использование возможно тогда, когда поле проекта transfer_allowed = True. Доступ у создателя проекта",
                   request=ProjectClosureRequestSerializer
                   )
    @action(methods=['POST'], detail=True)
    def close_money_collection(self, request, *args, **kwargs):
        project = self.get_object()
        serializer = ProjectClosureRequestSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            project.set_payment_stop_status()
            serializer.save(project=project)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(summary="Снятие денег с проекта",
                   description="Оно возможно, если проект имеет статус завершенного и запрос делает создатель проекта",
                   )
    @action(methods=['POST'], detail=True)
    def cash_out(self, request, *args, **kwargs):
        print(request.user)
        project = self.get_object()
        try:
            cash_out_project(project)
            return Response({"data": 'Операция выполнена'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'data': 'Операция невозможна'}, status=status.HTTP_400_BAD_REQUEST)


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

    @extend_schema(summary="Показать заявки на изменение проектов",
                   description="Доступ только у админов")
    # Покащать список заявок на изменение проекта
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(summary="Удаление заявки на изменение проекта",
                   description="Удаление возможно только в том случае, если он не содержит ответов от администратора. Доступ у создателя заявки")
    def destroy(self, request, *args, **kwargs):
        try:
            AnswerProjectChangeRequest.objects.get(change_request=self.get_object())
        except ObjectDoesNotExist:
            return super().destroy(request, *args, **kwargs)
        return Response({"data": "Нельзя удалить этот объект, так как он содержит ответы от администраторов"},
                        status=status.HTTP_200_OK)

    # Подтвердить/отклонить изменение проекта. При подтверждении перезаписывается запись проекта
    @extend_schema(summary="Метод для подтверждения/отклонения изменения проектов",
                   description="Доступ у админов",
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
    @extend_schema(summary="Эндпоинт для отслеживания заявок создателями",
                   description="Необходимо юзерам для просмотра всех своих созданных заявок")
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
    @method_decorator(cache_page(60 * 5, key_prefix='profile_page'))
    def retrieve(self, request, *args, **kwargs):
        if (self.get_object() == self.request.user) or (self.request.user.is_staff):
            self.serializer_class = AdditionalUserSerializerForOwner
        else:
            if self.get_object().confirmed is False and self.request.user.is_staff is False:
                return Response(status=status.HTTP_404_NOT_FOUND)
            self.serializer_class = AdditionalUserSerializerForOther
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(summary="Регистрация",
                   request=RegistrationSerializer)
    def create(self, request, *args, **kwargs):
        self.serializer_class = RegistrationSerializer
        return super().create(request, *args, **kwargs)

    @extend_schema(summary="Изменение своих скиллов и категорий юзером",
                   description="Юзер сам может менять свои скиллы и необходимые категории для него. Доступ у владельца профиля",
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
            send_message_verification_email.delay(user.pk)
            return Response(data={"На вашу почту была отправлена ссылка на подтверждение"}, status=status.HTTP_200_OK)
        return Response(data={"Вы не авторизированы"}, status=status.HTTP_200_OK)

    @extend_schema(summary="Создание заявки на изменение профиля",
                   description="Создание заявки, которая будет отсмотрена и подтверждена/отклонена админом. Поля "
                               "необязательны - юзер заполняет то, что он хочет поменять в своем профиле. Доступ у владельца профиля",
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

    @extend_schema(summary="Просмотреть проекты, которые поддержал пользователь")
    @action(methods=['GET'], detail=True)
    def get_payment_projects(self, request, *args, **kwargs):
        user = self.get_object()
        projects = Project.objects.filter(transaction__user=user).distinct()
        serializer = ProjectSerializer(projects, many=True, context={'request': request})
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
    queryset = ProfileChangeRequest.objects.all().order_by("-create_date")
    serializer_class = ChangeProfileRequestSerializer

    def get_permissions(self):
        return get_profile_change_request_view_permissions(self)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @extend_schema(summary="Показать все заявки на изменение профиля. Доступ у админов")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(summary="Удаление заявки на изменение профиля",
                   description="Удаление возможно только в том случае, если он не содержит ответов от администратора. Доступ у создателя заявки")
    def destroy(self, request, *args, **kwargs):
        try:
            AnswerProjectChangeRequest.objects.get(change_request=self.get_object())
        except ObjectDoesNotExist:
            return super().destroy(request, *args, **kwargs)
        return Response({"data": "Нельзя удалить этот объект, так как он содержит ответы от администраторов"},
                        status=status.HTTP_200_OK)

    @extend_schema(summary="Посмотреть заявку на изменение профиля",
                   description="Доступ у админа и создателя заявки")
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

    @extend_schema(summary="Просмотр ответов админов на заявку",
                   description="Необходимо для юзеров, для того чтобы посмотреть на ответ админа на свою заявку. Доступ у создателя заявки",
                   )
    @action(methods=['GET'], detail=True)
    def see_admin_response(self, request, *args, **kwargs):
        change_request = self.get_object()
        answer = AnswerProfileChangeRequest.objects.filter(profile=change_request).order_by('-answer_date')
        serializer = AnswerChangeProfileSerializer(answer, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="Просмотр владельцем всех своих заявок ",
                   description="Необходимо для юзеров, для того чтобы посмотреть все свои заявки",
                   )
    @action(methods=['GET'], detail=False)
    def show_requests(self, request, *args, **kwargs):
        requests = ProfileChangeRequest.objects.filter(profile=request.user)
        serializers = ChangeProfileRequestSerializer(requests, many=True, context={'request': request})
        return Response(serializers.data, status=status.HTTP_200_OK)


class ProjectClosureRequestViewSet(mixins.ListModelMixin,
                                   mixins.RetrieveModelMixin,
                                   mixins.DestroyModelMixin,
                                   viewsets.GenericViewSet):
    queryset = ProjectClosureRequest.objects.all()
    serializer_class = AnswerProjectClosureRequestSerializer

    def get_permissions(self):
        return get_closure_request_view_permissions(self)

    @extend_schema(summary="Просмотр заявок на закрытие проекта",
                   description="Необходимо для админов",
                   )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(summary="Удаление заявки на закрытие",
                   description="Доступно создателям проекта",
                   )
    def destroy(self, request, *args, **kwargs):
        req = self.get_object()
        project = req.project
        project.set_inwork_status()
        return super().destroy(request, *args, **kwargs)

    @extend_schema(summary="Просмотр своих заявок на закрытие проекта",
                   description="Необходимо для юзеров, создавших заявку",
                   )
    @action(methods=['GET'], detail=False)
    def see_request(self, request, *args, **kwargs):
        user = request.user
        requests = ProjectClosureRequest.objects.filter(project__user=user).order_by('-date')
        data = self.serializer_class(requests, many=True, context={'request': request})
        return Response(data.data, status=status.HTTP_200_OK)

    @extend_schema(summary="Ответ на заявку пользователям",
                   description="Необходимо для админов",
                   request=AnswerProjectClosureRequestSerializer
                   )
    @action(methods=['PUT'], detail=True)
    def answer(self, request, *args, **kwargs):
        project_closure_request = self.get_object()
        serializer_data = self.serializer_class(project_closure_request, data=request.data,
                                                context={'request': request})

        if serializer_data.is_valid():
            serializer_data.save()
            return Response(serializer_data.data, status=status.HTTP_200_OK)
        return Response(serializer_data.errors, status=status.HTTP_400_BAD_REQUEST)


# Служебное вью для просмотра id всех категорий
class AdditionalTag(APIView):
    @extend_schema(summary="Сервисный эндпоинт для получения доп. информации",
                   description="Для Владика Бобова. Тут ты получишь все ключи на категории, скиллы, группы")
    def get(self, request):
        try:
            category = Category.objects.all()
            skills = Skill.objects.all()
            group = Group.objects.all()
            status_codes = ProjectStatusCode.objects.all()
            serializer_group = GroupSerializerForAdditionalView(group, many=True)
            serializer_skill = SkillSerializer(skills, many=True)
            serializer_category = CategorySerializer(category, many=True)
            serializer_status_code = ProjectStatusCodeSerializer(status_codes, many=True)
            data = {
                "groups": serializer_group.data,
                "skills": serializer_skill.data,
                "category": serializer_category.data,
                "status_codes": serializer_status_code.data
            }
            return Response(data)
        except:
            return Response({'error': "Произошла ошибка"}, status=status.HTTP_418_IM_A_TEAPOT)
