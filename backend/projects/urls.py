from django.urls import path
from . import views
from tasks import views as task_views

urlpatterns = [
    path("create/", views.ProjectListCreateView.as_view(),name="project-create"),
    path("<uuid:pk>/", views.ProjectDetailView.as_view()),
    path("", views.ProjectListView.as_view(), name="project-list"),

    path("<uuid:project_id>/tasks/", task_views.TaskListCreateView.as_view()),
]