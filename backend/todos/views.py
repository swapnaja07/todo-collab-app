from urllib import response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.contrib.auth.models import User

from todos.utils import has_access
from .models import Task, TodoList
from sharing.models import SharedAccess
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_lists(request):
    owned = TodoList.objects.filter(owner=request.user)
    shared = TodoList.objects.filter(shared_users__user=request.user)

    lists = (owned | shared).distinct()

    return Response([
        {"id": l.id, "title": l.title}
        for l in lists
    ])

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_list(request):
    title = request.data.get("title")

    if not title:
        return Response({"error": "Title required"}, status=400)

    todo_list = TodoList.objects.create(
        title=title,
        owner=request.user
    )

    return Response({
        "id": todo_list.id,
        "title": todo_list.title
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def share_list(request):
    email = request.data.get("email")
    list_id = request.data.get("list_id")

    try:
        user = User.objects.get(email=email)
        todo_list = TodoList.objects.get(id=list_id)

        if todo_list.owner != request.user:
            return Response({"error": "Only owner can share"}, status=403)

        SharedAccess.objects.get_or_create(
            todo_list=todo_list,
            user=user
        )

        return Response({"message": "Shared successfully"})

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_tasks(request, list_id):
    if not has_access(request.user, list_id):
        return Response({"error": "Unauthorized"}, status=403)

    tasks = Task.objects.filter(todo_list_id=list_id)

    return Response([
        {"id": t.id, "title": t.title, "column": t.column}
        for t in tasks
    ])

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_task(request):
    title = request.data.get("title")
    list_id = request.data.get("list_id")

    if not has_access(request.user, list_id):
        return Response({"error": "Unauthorized"}, status=403)

    task = Task.objects.create(
        title=title,
        todo_list_id=list_id
    )

    return Response({
        "id": task.id,
        "title": task.title,
        "column": task.column
    })

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_task(request, id):
    try:
        task = Task.objects.get(id=id)

        if not has_access(request.user, task.todo_list.id):
            return Response({"error": "Unauthorized"}, status=403)

        task.title = request.data.get("title", task.title)
        task.column = request.data.get("column", task.column)
        task.save()

        return Response({"message": "Updated"})

    except Task.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_task(request, id):
    try:
        task = Task.objects.get(id=id)

        if not has_access(request.user, task.todo_list.id):
            return Response({"error": "Unauthorized"}, status=403)

        task.delete()
        return Response({"message": "Deleted"})

    except Task.DoesNotExist:
        return Response({"error": "Not found"}, status=404)