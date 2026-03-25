from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from sharing.models import SharedAccess
from notifications.models import Notification
from django.conf import settings

User = get_user_model()


@api_view(['POST'])
def share_list(request):
    email = request.data.get('email')
    list_id = request.data.get('list_id')

    user = User.objects.get(email=email)

    SharedAccess.objects.create(todo_list_id=list_id, user=user)

    send_mail(
        "List Shared",
        "A list was shared with you",
        settings.EMAIL_HOST_USER,
        [email],
    )

    Notification.objects.create(user=user, message="List shared with you")

    return Response({"msg": "shared"})
