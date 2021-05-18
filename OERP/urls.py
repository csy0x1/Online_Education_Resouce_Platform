"""OERP URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import django_comments.urls
from django.conf.urls import url
from django.contrib import admin
from django.urls import path
from django.urls.conf import include
from index import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('index.urls')),
    path('login/',views.login),
    path('register/',views.register),
    path('logout/',views.logout),
    path('captcha/', include('captcha.urls')),
    path('setting/',views.settings),
    path('profile/',views.profile),
    path('avatar/',views.avatar),
    path('aboutus/',views.aboutus),
    path('course/',include('index.urls')),
    path('list/',views.list),
    url(r'^comments/', include(django_comments.urls)),

]
