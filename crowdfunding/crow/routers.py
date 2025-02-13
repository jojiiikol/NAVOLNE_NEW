from rest_framework import routers
from .views import ProjectViewSet, ProjectChangeRequestViewSet, ProfileViewSet, ProfileChangeRequestViewSet, \
    ProjectClosureRequestViewSet, PostViewSet

projects_router = routers.SimpleRouter()
projects_router.register(r'projects', ProjectViewSet)

project_change_request_router = routers.SimpleRouter()
project_change_request_router.register(r'project_change_requests', ProjectChangeRequestViewSet)

profile_router = routers.SimpleRouter()
profile_router.register(r'profiles', ProfileViewSet)

profile_change_requests_router = routers.SimpleRouter()
profile_change_requests_router.register(r'profile_change_requests', ProfileChangeRequestViewSet)

project_closure_request_router = routers.SimpleRouter()
project_closure_request_router.register(r'project_closure_requests', ProjectClosureRequestViewSet)

post_router = routers.SimpleRouter()
post_router.register(r'posts', PostViewSet)