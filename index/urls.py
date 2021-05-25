from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.urls import path
from django.urls.conf import re_path

from . import views

app_name = 'index'

urlpatterns = [
    path('', views.index, name='index'),
    path('index/',views.index),
    path('course/<int:courseid>/SignUp',views.SignUp),
    path('course/<int:courseid>/Resign',views.Resign),
    path('course/<int:courseid>/saveNode',views.saveNode),
    path('course/<int:courseid>/getNode',views.getNode),
    path('course/<int:courseid>/Setting',views.courseSetting, name='courseSetting'),
    path('course/<int:courseid>/',views.courseInfo, name='courseInfo'),
    #path('test/test',views.index) http://*link*/test/test 也可访问index
] + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
