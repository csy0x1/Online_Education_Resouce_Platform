from captcha.fields import CaptchaField
from django import forms
from django.db.models import fields
from django.db.models.base import Model
from django.db.models.fields import CharField, DateTimeField
from django.forms import ModelForm, widgets
from django.forms.fields import ChoiceField, ImageField
from django.forms.models import ModelChoiceField
from django.forms.widgets import (
    ChoiceWidget,
    ClearableFileInput,
    EmailInput,
    Select,
    Textarea,
    TextInput,
)

from index.models import Course, CourseFiles, CourseNotice, Section, Users


class userForm(forms.Form):
    username = forms.CharField(label="用户名", max_length=128, widget=forms.TextInput)
    password = forms.CharField(label="密码", max_length=256, widget=forms.PasswordInput)
    re_password = forms.CharField(
        label="重复密码", max_length=256, widget=forms.PasswordInput
    )
    email = forms.EmailField(label="电子邮箱")
    captcha = CaptchaField(label="验证码")


class settingForm(ModelForm):
    class Meta:
        model = Users
        exclude = ["access", "selected_course", "create_time", "is_deleted"]
        widgets = {
            "name": TextInput(attrs={"class": "form-control"}),
            "real_name": TextInput(attrs={"class": "form-control"}),
            "email": EmailInput(attrs={"class": "form-control"}),
            "phone_number": TextInput(attrs={"class": "form-control"}),
            "sex": Select(attrs={"class": "form-control"}),
        }


class CourseSettingForm(ModelForm):
    Course_Img = forms.ImageField(
        label=("课程图片"), required=False, widget=forms.FileInput
    )

    def __init__(self, *args, **kwargs):
        super(CourseSettingForm, self).__init__(*args, **kwargs)
        for field in iter(self.fields):
            if field == "Course_Img":
                self.fields[field].widget.attrs.update(
                    {
                        "id": "updateImg",
                        "class": "file-loading",
                        "data-browse-on-zone-click": "true",
                    }
                )
            else:
                self.fields[field].widget.attrs.update(
                    {
                        "class": "form-control col-sm-10",
                    }
                )

    class Meta:
        model = Course
        exclude = [
            "Status",
            "Course_Teacher",
            "Stu_Count",
            "Course_Chapter",
            "View_Count",
        ]


class NoticeForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(NoticeForm, self).__init__(*args, **kwargs)
        for field in iter(self.fields):
            self.fields[field].widget.attrs.update(
                {
                    "class": "form-control col-sm-10",
                }
            )

    class Meta:
        model = CourseNotice
        exclude = [
            "sourceCourse",
        ]


class CourseFilesForm(ModelForm):
    class Meta:
        model = CourseFiles
        # fields = ["courseFile"]
        fields = ["courseFile"]
        widgets = {
            "courseFile": ClearableFileInput(
                attrs={"multiple": True, "class": "form-control"}
            ),
        }
