from django.db import models
from django.conf import settings
from todos.models import TodoList

User = settings.AUTH_USER_MODEL


class SharedAccess(models.Model):
    todo_list = models.ForeignKey(TodoList, on_delete=models.CASCADE, related_name="shared_users")
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('todo_list', 'user')