from django.core.checks import messages
from django.http.request import HttpRequest
from django.shortcuts import redirect, render
from . import models

# Create your views here.

def index(request):
    return render(request, 'index/index.html')

def login(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        message = '请检查输入的内容'
        if username.strip() and password:   #确保用户名和密码不为空
            pass    #做合法性检测
            try:
                user = models.Users.objects.get(name=username)
            except: #出错
                message = '用户不存在!'
                return render(request,'index/login.html',{'message':message})
            if user.password == password:   #密码不能为明码，需修改
                return redirect('/index/')
            else:
                message = '密码错误!'
                return render(request,'index/login.html',{'message':message})
        else:
                return render(request,'index/login.html',{'message':message})
    return render(request,'index/login.html')

def register(request):
    return  render(request,'index/register.html')

def logout(request):
    return redirect('/index/')