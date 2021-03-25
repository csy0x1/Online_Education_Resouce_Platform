from django import forms
from captcha.fields import CaptchaField

class userForm(forms.Form):
    username=forms.CharField(label="用户名", max_length=128,widget=forms.TextInput)
    password=forms.CharField(label="密码",max_length=256,widget=forms.PasswordInput)
    re_password=forms.CharField(label="重复密码",max_length=256,widget=forms.PasswordInput)
    email=forms.EmailField(label="电子邮箱")
    captcha=CaptchaField(label="验证码")

class settingForm(forms.Form):
    avatar=forms.ImageField(label="头像")
    username=forms.CharField(label="用户名",max_length=128,widget=forms.TextInput)
    realname=forms.CharField(label="真实姓名",max_length=128,widget=forms.TextInput)
    password=forms.CharField(label="密码",max_length=256,widget=forms.PasswordInput)
    email=forms.EmailField(label="电子邮箱")
