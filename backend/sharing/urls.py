from django.urls import path
from .views import share_list

urlpatterns = [
    path('share/', share_list),
]