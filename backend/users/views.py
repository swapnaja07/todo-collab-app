from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

User = get_user_model()


@api_view(['POST'])
def signup(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if User.objects.filter(username=email).exists():
        return Response({"error": "User exists"}, status=400)

    User.objects.create_user(
        username=email,
        email=email,
        password=password
    )

    return Response({"message": "User created"}, status=201)

@api_view(['GET','POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(username=email, password=password)

    if user is None:
        return Response({"error": "Invalid credentials"}, status=400)

    refresh = RefreshToken.for_user(user)
    if request.method == "GET":
        return Response({"msg": "Login API working. Use POST."})

    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "user": user.username
    })


