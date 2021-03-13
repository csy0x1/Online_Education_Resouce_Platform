from email import message
from django.core.checks import messages
from django.http.request import HttpRequest
from django.shortcuts import redirect, render
from . import models

# Create your views here.

def index(request):
    return render(request, 'index/index.html')

def login(request):
    if request.session.get('is_login',None):    #不允许重复登录
        return redirect('/index/')
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
                request.session['is_login'] = True
                request.session['user_id'] = user.id
                request.session['user_name'] = user.name
                request.session['avatar'] = user.profile_picture.url
                print(user.profile_picture.url)
                return redirect('/index/')
            else:
                message = '密码错误!'
                return render(request,'index/login.html',{'message':message})
        else:   #输入内容有误
                return render(request,'index/login.html',{'message':message})
    return render(request,'index/login.html')

def register(request):
    if request.session.get('is_login',None):
        return redirect('/index/')

    if request.method == 'POST':
        message='请检查输入的内容'
        username = request.POST.get('username').strip()
        password = request.POST.get('password')
        re_password = request.POST.get('re_password')
        email = request.POST.get('email')
        gender = request.POST.get('gender')
        if message and username and password and re_password and email and gender:
            if password != re_password:
                message='两次输入的密码不一致'
                return render(request,'index/register.html',locals())
            else:
                same_name_user = models.Users.objects.filter(name=username)
                if same_name_user:
                    message='用户名已被注册'
                    return render(request,'index/register.html',locals())
                same_email_user = models.Users.objects.filter(email=email)
                if same_email_user:
                    message='该邮箱已被注册'
                    return render(request,'index/register.html',locals())
                
                new_user = models.Users()
                new_user.name = username
                new_user.password = re_password
                new_user.email = email
                new_user.gender = gender
                new_user.save()

                return redirect('/login/')
        else:
            return render(request,'index/register.html',locals())

    return render(request,'index/register.html')

def logout(request):
    if not request.session.get('is_login',None):
        return redirect('/login/')
    request.session.flush()
    return redirect('/index/')