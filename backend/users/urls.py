from django.urls import path
from .views import login_view, signup

urlpatterns = [
    path('signup/', signup),
    path('login/', login_view),
]