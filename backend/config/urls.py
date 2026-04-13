from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", include("users.urls")),
    path("projects/", include("projects.urls")),
    path("",include("tasks.urls")),
]
