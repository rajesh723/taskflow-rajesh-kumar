from rest_framework import generics, permissions
from .models import Project
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .serializers import ProjectSerializer, ProjectDetailSerializer
from rest_framework.exceptions import PermissionDenied


# GET all projects + POST create
class ProjectListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


# # GET one, PATCH, DELETE
class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return Project.objects.filter(
            Q(owner=user) |
            Q(tasks__assignee=user)
        ).distinct()

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ProjectDetailSerializer
        return ProjectSerializer

    def perform_update(self, serializer):
        project = self.get_object()

        if project.owner != self.request.user:
            raise PermissionDenied("Only owner can update this project")

        serializer.save()

    def perform_destroy(self, instance):
        if instance.owner != self.request.user:
            raise PermissionDenied("Only owner can delete this project")

        instance.delete()

class ProjectListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        projects = Project.objects.filter(
            Q(owner=user) |
            Q(tasks__assignee=user)
        ).distinct()

        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data, status=200)