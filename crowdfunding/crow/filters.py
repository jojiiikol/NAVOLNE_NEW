from django.db.models import Count
from django_filters import OrderingFilter
# from rest_framework import filters
from django_filters import rest_framework as filters
from rest_framework.filters import BaseFilterBackend

from crow.models import Project


class ProjectFilter(filters.FilterSet):
    ordering = filters.OrderingFilter(fields=
                                        {
                                            "views_count": "views_count",
                                            "start_date": "start_date",
                                            "collected_money": "collected_money",
                                        })

    name = filters.CharFilter(field_name="name", lookup_expr='icontains')
    status_code__code = filters.NumberFilter(field_name="status_code__code", lookup_expr='exact')
    class Meta:
        model = Project
        fields = ['category']

    def filter_queryset(self, queryset):
        queryset = queryset.annotate(views_count=Count('views'))
        return super().filter_queryset(queryset)