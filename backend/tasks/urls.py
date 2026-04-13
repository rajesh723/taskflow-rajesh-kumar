from django.urls import path
from . import views
urlpatterns = [
    path("tasks/<uuid:pk>/", views.TaskUpdateDeleteView.as_view()),
]