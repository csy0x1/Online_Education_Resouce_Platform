from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings


app_name = 'index'

urlpatterns = [
    path('', views.index, name='index'),
    path('index/',views.index),
    path('<int:courseid>/',views.courseInfo),
    #path('test/test',views.index) http://*link*/test/test 也可访问index
] + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)