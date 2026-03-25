from .models import TodoList
from sharing.models import SharedAccess


def has_access(user, list_id):
    return (
        TodoList.objects.filter(id=list_id, owner=user).exists()
        or SharedAccess.objects.filter(todo_list_id=list_id, user=user).exists()
    )