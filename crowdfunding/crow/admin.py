from crow.models import *
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from .views import ResetPassword


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'confirmed')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'confirmed')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    pass

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    pass

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    pass

@admin.register(ProjectChangeRequest)
class ProjectChangeRequestAdmin(admin.ModelAdmin):
    pass

@admin.register(VerificationToken)
class VerificationTokenAdmin(admin.ModelAdmin):
    pass

@admin.register(ResetPasswordToken)
class ResetPasswordTokenAdmin(admin.ModelAdmin):
    pass

@admin.register(ProfileChangeRequest)
class ProfileChangeRequestAdmin(admin.ModelAdmin):
    pass

@admin.register(AnswerProfileChangeRequest)
class AnswerProfileChangeRequestAdmin(admin.ModelAdmin):
    pass

@admin.register(AnswerProjectChangeRequest)
class AnswerProjectChangeRequestAdmin(admin.ModelAdmin):
    pass

@admin.register(ProjectConfirmAnswer)
class ProjectConfirmAnswerAdmin(admin.ModelAdmin):
    pass

@admin.register(ProfileConfirmAnswer)
class ProfileConfirmAnswer(admin.ModelAdmin):
    pass


