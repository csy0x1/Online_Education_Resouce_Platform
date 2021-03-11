from django.urls import path
from . import views

app_name = 'index'

urlpatterns = [
    path('', views.index, name='index'),
    path('index/',views.index),
    #path('test/test',views.index) http://*link*/test/test 也可访问index
]