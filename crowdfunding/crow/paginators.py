from rest_framework.pagination import PageNumberPagination
from .models import Project

class AllProjectsPaginator(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 15


class AllPostsPaginator(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 30