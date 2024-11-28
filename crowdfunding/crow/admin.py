from crow.models import *
from django.contrib import admin
from .models import User



@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'confirmed')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    pass


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    pass


class NewImageToProject(admin.TabularInline):
    model = NewImageToProject


@admin.register(ProjectChangeRequest)
class ProjectChangeRequestAdmin(admin.ModelAdmin):
    inlines = [NewImageToProject]


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
    list_display = ('project', 'user', 'confirmed', )


@admin.register(ProfileConfirmAnswer)
class ProfileConfirmAnswer(admin.ModelAdmin):
    list_display = ('profile', 'user', 'confirmed',)


class ProjectImagesAdmin(admin.TabularInline):
    model = ProjectImages


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'status_code')
    inlines = [ProjectImagesAdmin]

@admin.register(ProjectStatusCode)
class ProjectStatusCodeAdmin(admin.ModelAdmin):
    pass

@admin.register(ProjectClosureRequest)
class ProjectClosureRequestAdmin(admin.ModelAdmin):
    pass

@admin.register(CommissionRules)
class CommissionRulesAdmin(admin.ModelAdmin):
    pass
