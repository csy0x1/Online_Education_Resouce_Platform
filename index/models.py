from django.db import models

# Create your models here.

class Users(models.Model):
    gender = (
        ('male','男'),
        ('female','女'),
    )

    profile_picture = models.ImageField(verbose_name='头像',null=True,upload_to='avatar',blank=True,default='avatar/default-profile-picture.jpg')
    name = models.CharField(verbose_name='*用户名',max_length=128,unique=True,null=False)  #昵称
    real_name = models.CharField(verbose_name='真实姓名',max_length=64,null=True,blank=True) #真实姓名
    password = models.CharField(verbose_name='*密码',max_length=256) #密码
    email = models.EmailField(verbose_name='*电子邮箱',unique=True)  #邮箱
    selected_course = models.CharField(verbose_name='已选课程',max_length=256,null=True,blank=True)  #已选课程
    sex = models.CharField(verbose_name='*性别',max_length=32,choices=gender,default='男')   #性别
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
        else:
            pass
