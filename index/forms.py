from django.db.models.fields import CharField
from django.forms import widgets
from index.models import Users
from django import forms
from captcha.fields import CaptchaField
from django.db.models.base import Model
from django.forms.fields import ChoiceField
from django.forms.widgets import ChoiceWidget, EmailInput, Select, TextInput
from django.forms import ModelForm

class userForm(forms.Form):
    username=forms.CharField(label="用户名", max_length=128,widget=forms.TextInput)
    password=forms.CharField(label="密码",max_length=256,widget=forms.PasswordInput)
    re_password=forms.CharField(label="重复密码",max_length=256,widget=forms.PasswordInput)
    email=forms.EmailField(label="电子邮箱")
    captcha=CaptchaField(label="验证码")

class settingForm(ModelForm):
    class Meta:
        model = Users
        exclude = ['access','selected_course','create_time','is_deleted']
        widgets={
            'name':TextInput(attrs={'class':'form-control'}),
            'real_name':TextInput(attrs={'class':'form-control'}),
            'email':EmailInput(attrs={'class':'form-control'}),
            'phone_number':TextInput(attrs={'class':'form-control'}),
            'sex':Select(attrs={'class':'form-control'}),
        }