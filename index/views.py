from django.http.request import HttpRequest
from django.shortcuts import redirect, render

# Create your views here.

def index(request):
    return render(request, 'index/index.html')

def login(request):
    return render(request,'index/login.html')

def register(request):
    return  render(request,'index/register.html')

def logout(request):
    return redirect('/index/')