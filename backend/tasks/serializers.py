from rest_framework import serializers
from .models import Task
from django.contrib.auth import get_user_model

User = get_user_model()

class TaskSerializer(serializers.ModelSerializer):
    # ✅ This line FIXES your error
    assignee = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False,
        allow_null=True
    )

    assignee_details = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = ["id", "project", "created_at", "updated_at"]

    def get_assignee_details(self, obj):
        if obj.assignee:
            return {
                "id": obj.assignee.id,
                "name": obj.assignee.username
            }
        return None