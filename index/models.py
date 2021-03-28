from django.db import models

# Create your models here.

class Users(models.Model):
    gender = (
        ('male','男'),
        ('female','女'),
        ('default','保密'),
    )

    access = (
        ('guest','访客'),
        ('student','学生'),
        ('teacher','教师'),
    )
    

    profile_picture = models.ImageField(verbose_name='头像',null=True,upload_to='avatar',blank=True,default='avatar/default-profile-picture.jpg')
    name = models.CharField(verbose_name='*用户名',max_length=128,unique=True,null=False)  #昵称
    real_name = models.CharField(verbose_name='真实姓名',max_length=64,null=True,blank=True) #真实姓名
    password = models.CharField(verbose_name='*密码',max_length=256) #密码
    email = models.EmailField(verbose_name='*电子邮箱',unique=True)  #邮箱
    phone_number = models.CharField(verbose_name='手机号码',max_length=32,unique=True,null=True,blank=True)   #手机号码
    access = models.CharField(verbose_name='*权限等级',max_length=16,choices=access,default='guest')    #权限级别
    selected_course = models.CharField(verbose_name='已选课程',max_length=256,null=True,blank=True)  #已选课程
    sex = models.CharField(verbose_name='*性别',max_length=32,choices=gender,default='default')   #性别
    create_time = models.DateTimeField(verbose_name='账号创建时间',auto_now_add=True)   #创建时间
    is_deleted = models.BooleanField(verbose_name='删除标记',default=False,editable=False) #删除标记

    def __str__(self) -> str:
        return self.name
    
    class Meta:
        ordering = ["-create_time"]
        verbose_name = '用户'
        verbose_name_plural = '用户'

    def avatar_url(self):
        if self.profile_picture and hasattr(self.profile_picture,'url'):
            return self.profile_picture.url

class Course(models.Model):
    status = (
        ('1','未开课'),
        ('2','已开课'),
        ('3','已结课'),
    )
    Course_Name = models.CharField(verbose_name="课程名称",max_length=64)
    Course_Teacher = models.CharField(verbose_name="开课教师",max_length=32)
    Course_Info = models.CharField(verbose_name="课程说明",max_length=400)
    Course_Img = models.ImageField(verbose_name="课程图片",null=True,upload_to="Course_Img",blank=True)
    Stu_Count = models.IntegerField(verbose_name="选课人数")
    Course_Category = models.CharField(verbose_name="课程分类",max_length=32)
    View_Count = models.IntegerField(verbose_name="访问人数")
    Status = models.CharField(verbose_name="课程状态",max_length=16,choices=status,default='1')
    Starting_Time = models.DateTimeField(verbose_name="开课时间",auto_now_add=True)
    Ending_Time = models.DateTimeField(verbose_name="结课时间")

    class Meta:
        ordering = ["-Starting_Time"]
        verbose_name = '课程'
        verbose_name_plural = '课程'