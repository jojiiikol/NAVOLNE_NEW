from django.contrib.auth.models import Group
from rest_framework import serializers

from crow.models import Category, Skill, ProjectStatusCode


class CategoryListing(serializers.PrimaryKeyRelatedField):
    queryset = Category.objects.all()

    def display_value(self, instance):
        return instance.name

    def to_representation(self, value):
        return value.name


class SkillListing(serializers.PrimaryKeyRelatedField):
    queryset = Skill.objects.all()

    def display_value(self, instance):
        return instance.name

    def to_representation(self, value):
        return value.name

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'


class GroupSerializerForAdditionalView(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("id", "name",)


class ProjectStatusCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectStatusCode
        fields = ('code', 'name')