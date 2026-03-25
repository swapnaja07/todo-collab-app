from django.urls import path
from .views import *

urlpatterns = [
    path('lists/', get_lists),
    path('lists/create/', create_list), 
    path('tasks/<int:list_id>/', get_tasks),
    path('tasks/create/', create_task),
    path('tasks/update/<int:id>/', update_task),
    path('share/', share_list),
    path('tasks/delete/<int:id>/', delete_task),
]