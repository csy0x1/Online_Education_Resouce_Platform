from email import message
import email,json
from django.core.checks import messages
from django.http.request import HttpRequest
from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, hashers
from .functions import viewFunction as VF
from . import models
from . import forms
from django.views.decorators.clickjacking import xframe_options_exempt


# Create your views here.

def index(request):
    rootlist,dict=VF.Get_Category()
    userCount,newestUser,courseCount = VF.Get_Website_Info().values() #locals()以字典形式返回所有局部变量，要用values()取出值，否则获取的为key
    #testjson = json.dumps(testjson)    #向JSONfield传递json可以直接传dict，不用编码成json
    #VF.test(testjson)
    return render(request, 'index/indexpage.html',locals()) 

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
            if hashers.check_password(password,user.password):
                request.session['is_login'] = True
                request.session['user_id'] = user.id
                request.session['user_name'] = user.name
                request.session['avatar'] = user.profile_picture.url
                #request.session.set_expiry(0)
                #print(user.profile_picture.url)
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
        reg_form=forms.userForm(request.POST)
        if reg_form.is_valid():
            username = reg_form.cleaned_data.get('username')
            password = reg_form.cleaned_data.get('password')
            re_password = reg_form.cleaned_data.get('re_password')
            email = reg_form.cleaned_data.get('email')
            captcha = reg_form.cleaned_data.get('captcha')
            
            tempuser = models.Users.objects.filter(name=username)
            tempmail = models.Users.objects.filter(email=email)
            print(tempuser,tempmail)
            if tempuser:
                print('1')
                message='用户名已被注册'
                return render(request,'index/register.html',locals())
            if tempmail:
                print('2')
                message='邮箱已被注册'
                return render(request,'index/register.html',locals())
            if password!=re_password:
                message='两次输入的密码不一致'
                return render(request,'index/register.html',locals())
            else:
                new_user = models.Users()
                new_user.name = username
                new_user.password = hashers.make_password(re_password,None,'pbkdf2_sha256')
                new_user.email = email
                new_user.save()
                return redirect('/login/')
        else:
            return render(request,'index/register.html',locals())
    
    reg_form = forms.userForm()
    return render(request,'index/register.html',locals())

def logout(request):
    if not request.session.get('is_login',None):
        return redirect('/login/')
    request.session.flush()
    return render(request,'index/info.html')

def settings(request):
    if request.method == 'POST':
        set_Form=forms.settingForm(request.POST)
        real_name = set_Form.cleaned_data.get('realname')
        e_mail = set_Form.cleaned_data.get('email')
        phone_number = set_Form.cleaned_data.get('phone_number')
        gender = set_Form.cleaned_data.get('gender')
    
    return render(request,'index/setting.html')
    
def profile(request):
    user = models.Users.objects.get(name=request.session['user_name'])
    profileForm=forms.settingForm(instance=user)
    return render(request,'index/profile.html',locals())

def avatar(request):
    user = models.Users.objects.get(name=request.session['user_name'])
    profileForm=forms.settingForm(instance=user)
    avatar = user.profile_picture.url
    return render(request,'index/avatar.html',locals())

def aboutus(request):
    return render(request,'index/aboutus.html')

def courseInfo(request,courseid):
    courseDetail,courseInfo = VF.Get_Course(courseid)
    return render(request,'index/courseInfo.html',locals())