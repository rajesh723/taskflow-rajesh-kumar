from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied
from projects.models import Project
from .models import Task
from .serializers import TaskSerializer


class TaskListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)

        tasks = Task.objects.filter(project=project)

        # Filters
        status = request.GET.get("status")
        assignee = request.GET.get("assignee")

        if status:
            tasks = tasks.filter(status=status)

        if assignee:
            tasks = tasks.filter(assignee=assignee)

        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)

        serializer = TaskSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(
                project=project
            )
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


class TaskUpdateDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(Task, id=pk)

    def check_permission(self, task, user):
        if not (task.assignee == user or task.project.owner == user):
            raise PermissionDenied("Not allowed")

    def patch(self, request, pk):
        task = self.get_object(pk)
        self.check_permission(task, request.user)

        serializer = TaskSerializer(task, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        task = self.get_object(pk)
        self.check_permission(task, request.user)

        task.delete()
        return Response(status=204)