from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class TodoList(models.Model):
    title = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_lists")

    def __str__(self):
        return self.title


class Task(models.Model):
    COLUMN_CHOICES = [
        ('backlog', 'Backlog'),
        ('todo', 'Todo'),
        ('inprogress', 'In Progress'),
        ('done', 'Done'),
    ]

    todo_list = models.ForeignKey(TodoList, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=255)
    column = models.CharField(max_length=20, choices=COLUMN_CHOICES, default='todo')

    def __str__(self):
        return self.title