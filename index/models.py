from datetime import datetime
from email.policy import default
import os
from tabnanny import verbose

from django.db import models
from django.db.models.deletion import CASCADE, SET_NULL
from django.db.models.fields import CharField, DateTimeField, TextField
from django.db.models.fields.files import FileField
from django.db.models.fields.related import ForeignKey
from django.db.models.lookups import IsNull
from django.forms import BooleanField
from django.contrib.auth.models import AbstractUser
import pytz

# Create your models here.


class Users(AbstractUser):
    gender = (
        ("male", "男"),
        ("female", "女"),
        ("default", "保密"),
    )

    access = (
        ("banned", "封禁用户"),
        ("guest", "访客"),
        ("student", "学生"),
        ("teacher", "教师"),
    )

    profile_picture = models.ImageField(
        verbose_name="头像",
        null=True,
        upload_to="avatar",
        blank=True,
        default="avatar/default-profile-picture.jpg",
    )
    # name = models.CharField(
    #     verbose_name="*用户名", max_length=128, unique=True, null=False
    # )  # 昵称
    real_name = models.CharField(
        verbose_name="真实姓名", max_length=64, null=True, blank=True, default="未填写"
    )  # 真实姓名
    password = models.CharField(
        verbose_name="*密码", max_length=256, editable=False
    )  # 密码
    email = models.EmailField(verbose_name="*电子邮箱", unique=True)  # 邮箱
    phone_number = models.CharField(
        verbose_name="手机号码", max_length=32, unique=True, null=True, blank=True
    )  # 手机号码
    access = models.CharField(
        verbose_name="*权限等级", max_length=16, choices=access, default="guest"
    )  # 权限级别
    # selected_course = models.CharField(verbose_name='已选课程',max_length=256,null=True,blank=True)  #已选课程
    selected_courses = models.ManyToManyField(
        "Course", related_name="students", null=True, blank=True, verbose_name="已选课程"
    )  # 已选课程
    sex = models.CharField(
        verbose_name="*性别", max_length=32, choices=gender, default="default"
    )  # 性别
    create_time = models.DateTimeField(verbose_name="账号创建时间", auto_now_add=True)  # 创建时间
    is_deleted = models.BooleanField(
        verbose_name="删除标记", default=False, editable=False
    )  # 删除标记

    # def __str__(self) -> str:
    #     return self.name

    class Meta:
        ordering = ["-create_time"]
        verbose_name = "用户"
        verbose_name_plural = "用户"

    def avatar_url(self):
        if self.profile_picture and hasattr(self.profile_picture, "url"):
            return self.profile_picture.url


class Course(models.Model):
    status = (
        ("1", "未开课"),
        ("2", "已开课"),
        ("3", "已结课"),
    )
    Course_Name = models.CharField(verbose_name="课程名称", max_length=64)
    Course_Teacher = models.ForeignKey(
        "Users",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="teacher",
        verbose_name="开课教师",
    )
    Assistant_Teacher = models.ManyToManyField(
        "Users", related_name="assistant", null=True, blank=True, verbose_name="助理教师"
    )
    Course_Info = models.TextField(verbose_name="课程说明", default="暂未设置")
    Course_Goal = models.TextField(verbose_name="课程目标", default="暂未设置")
    Grade_Requirements = models.TextField(verbose_name="成绩要求", default="暂未设置")
    Reference = models.TextField(verbose_name="参考资料", default="暂未设置")
    QA = models.TextField(verbose_name="常见问题", null=True, blank=True, default="暂未设置")
    Course_Img = models.ImageField(
        verbose_name="课程图片",
        null=True,
        upload_to="Course_Img",
        blank=True,
        default="material/defaultCourseImage.jpg",
    )
    Stu_Count = models.PositiveIntegerField(verbose_name="选课人数", default=0)
    Course_Chapter = models.TextField(
        verbose_name="课程章节",
        null=True,
        blank=True,
        default='[{"title":"New Node","key":"1"}]',
    )
    # Course_Category = models.CharField(verbose_name="课程分类",max_length=32,default='0')
    Course_Category = models.ForeignKey(
        "CourseCategory",
        verbose_name="课程分类",
        on_delete=models.CASCADE,
        limit_choices_to={"Is_Root": 0},
        null=True,
        blank=True,
    )
    View_Count = models.PositiveIntegerField(verbose_name="访问人数", default=0)
    Status = models.CharField(
        verbose_name="课程状态", max_length=16, choices=status, default="1"
    )
    Starting_Time = models.DateTimeField(verbose_name="开课时间", auto_now_add=True)
    Ending_Time = models.DateTimeField(verbose_name="结课时间", null=True, blank=True)

    def __str__(self) -> str:
        return self.Course_Name

    class Meta:
        ordering = ["-Starting_Time"]
        verbose_name = "课程"
        verbose_name_plural = "课程"


class CourseCategory(models.Model):
    # def Check_Category_Layer(self):
    #     if(self.ParentID==0):
    #         return self.ParentID
    CategoryID = models.AutoField(primary_key=True, verbose_name="分类编号")
    CategoryName = models.CharField(verbose_name="分类名", max_length=64)
    Is_Root = models.BooleanField(verbose_name="根分类", default=True, editable=False)
    DisplayOrder = models.PositiveIntegerField(verbose_name="显示顺序", default=1)
    ParentID = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        limit_choices_to={"Is_Root": 1},
        null=True,
        blank=True,
    )
    # CountNumber = models.IntegerField(verbose_name='下属分类数',default=0)

    def __str__(self) -> str:
        return self.CategoryName

    class Meta:
        ordering = ["-CategoryID"]
        verbose_name = "课程分类"
        verbose_name_plural = "课程分类"

    def save(self, *args, **kwargs):
        if self.ParentID_id is not None:
            self.Is_Root = False
            # temp=CourseCategory.objects.filter(CategoryID=self.ParentID_id)
            # print(temp[0])
            # temp=temp[0]
            # print(temp.CountNumber)
            # temp.CountNumber+=1 #增加分类计数
            # temp.save()
        super().save(*args, **kwargs)


class CourseNotice(models.Model):
    sourceCourse = ForeignKey(
        "Course",
        verbose_name="源课程",
        on_delete=CASCADE,
        null=True,
        blank=True,
        related_name="sourceCourse",
    )
    Title = CharField(verbose_name="公告标题", default="新公告标题", max_length=20)
    Message = TextField(verbose_name="课程公告", default="新公告内容")
    createTime = DateTimeField(verbose_name="发布时间", auto_now_add=True)

    def __str__(self) -> str:
        return self.Title

    class Meta:
        ordering = ["-createTime"]
        verbose_name = "课程公告"
        verbose_name_plural = "课程公告"


class Chapter(models.Model):
    sourceCourse = ForeignKey(
        "Course",
        verbose_name="源课程",
        on_delete=CASCADE,
        related_name="chapterSourceCourse",
    )
    chapterName = CharField(verbose_name="章名", max_length=100)

    def __str__(self) -> str:
        return self.chapterName

    class Meta:
        ordering = ["sourceCourse"]
        verbose_name = "章名"
        verbose_name_plural = "章名"


def Upload_File_Path(instance, filename):  # 文件上传目录回调函数
    return "courseFile/{0}/{1}/{2}/{3}".format(
        instance.sourceSection.sourceChapter.sourceCourse,
        instance.sourceSection.sourceChapter,
        instance.sourceSection,
        filename,
    )


class Section(models.Model):
    sourceChapter = ForeignKey(
        "Chapter", verbose_name="所属章", on_delete=CASCADE, related_name="sourceChapter"
    )
    sectionName = CharField(verbose_name="节名", max_length=100)

    def __str__(self) -> str:
        return self.sectionName

    class Meta:
        ordering = ["sourceChapter"]
        verbose_name = "节名"
        verbose_name_plural = "节名"


class CourseFiles(models.Model):
    sourceSection = ForeignKey(
        "Section",
        verbose_name="所属节",
        on_delete=SET_NULL,
        related_name="sourceSection",
        blank=True,
        null=True,
    )
    fileName = CharField(verbose_name="课件名称", max_length=100, default="新课件")
    courseFile = FileField(upload_to=Upload_File_Path, blank=True, null=True)

    def __str__(self) -> str:
        return self.courseFile.name

    def filename(self):
        return os.path.basename(self.courseFile.name)

    class Meta:
        ordering = ["sourceSection"]
        verbose_name = "课程文件"
        verbose_name_plural = "课程文件"


# 题库问题表
class QuestionBank(models.Model):
    sourceCourse = ForeignKey(
        "Course",
        verbose_name="所属课程",
        on_delete=CASCADE,
        related_name="Questions",
    )
    QuestionName = CharField(verbose_name="题目名称", max_length=200)
    QuestionType = CharField(verbose_name="题目类型", max_length=20)
    QuestionScore = models.PositiveIntegerField(verbose_name="题目分值", default=0)
    ReferenceCount = models.PositiveIntegerField(verbose_name="引用次数", default=0)
    PublicRelease = models.BooleanField(verbose_name="是否公开", default=False)

    def __str__(self) -> str:
        return self.QuestionName

    class Meta:
        verbose_name = "题库"
        verbose_name_plural = "题库"


# 题库选项表
class QuestionOption(models.Model):
    sourceQuestion = ForeignKey(
        "QuestionBank",
        verbose_name="所属题目",
        on_delete=CASCADE,
        related_name="Options",
    )
    OptionName = CharField(verbose_name="选项", max_length=100)

    class Meta:
        verbose_name = "题目选项"
        verbose_name_plural = "题目选项"


# 题库答案表
class QuestionAnswer(models.Model):
    sourceQuestion = ForeignKey(
        "QuestionBank",
        verbose_name="所属题目",
        on_delete=CASCADE,
        related_name="Answers",
    )
    Answer = ForeignKey(
        "QuestionOption",
        verbose_name="所属选项",
        on_delete=CASCADE,
        related_name="answer",
    )
    # Answer = CharField(verbose_name="答案", max_length=500)

    class Meta:
        verbose_name = "答案"
        verbose_name_plural = "答案"


# 试卷表
class Paper(models.Model):
    sourceCourse = ForeignKey(
        "Course",
        verbose_name="所属课程",
        on_delete=CASCADE,
        related_name="paperSourceCourse",
    )
    includedQuestions = models.ManyToManyField(
        "QuestionBank",
        verbose_name="包含题目",
        related_name="paperIncludedQuestion",
        through="PaperQuestionsInformation",
    )

    PaperName = CharField(verbose_name="试卷名称", max_length=100)
    PaperType = models.BooleanField(verbose_name="试卷类型", default=False)
    QuestionCount = models.PositiveIntegerField(verbose_name="题目数量", default=0)
    ExaminationTime = models.TimeField(verbose_name="考试时间")
    QuestionTotalScore = models.PositiveIntegerField(verbose_name="试卷总分", default=0)
    StartTime = models.DateTimeField(verbose_name="开始时间")
    EndTime = models.DateTimeField(verbose_name="结束时间")

    @property
    def is_started(self):
        if datetime.now().astimezone(pytz.timezone("UTC")) > self.StartTime:
            return True
        return False

    @property
    def is_expired(self):
        if datetime.now().astimezone(pytz.timezone("UTC")) > self.EndTime:
            return True
        return False

    def __str__(self) -> str:
        return self.PaperName

    class Meta:
        verbose_name = "试卷"
        verbose_name_plural = "试卷"


# 已作答试卷表
class AnsweredPaper(models.Model):
    sourcePaper = ForeignKey(
        "Paper",
        verbose_name="所属试卷",
        on_delete=CASCADE,
        related_name="answeredPaperSourcePaper",
    )
    candidates = models.ForeignKey(
        "Users",
        verbose_name="考生",
        on_delete=CASCADE,
        related_name="paperCandidates",
        null=True,
        blank=True,
    )
    StartTime = models.DateTimeField(verbose_name="开始时间")
    EndTime = models.DateTimeField(verbose_name="结束时间")
    Score = models.PositiveIntegerField(verbose_name="得分", default=0)
    Answersheet = models.ManyToManyField(
        "QuestionOption",
        verbose_name="答题卡",
        related_name="Answersheet",
        through="AnswerSheet",
        through_fields=("sourcePaper", "selectedOption"),
    )
    is_finished = models.BooleanField(verbose_name="是否完成", default=False)

    @property
    def is_expired(self):
        if datetime.now().astimezone(pytz.timezone("UTC")) > self.EndTime:
            return True
        return False


class PaperQuestionsInformation(models.Model):
    sourcePaper = ForeignKey(Paper, on_delete=CASCADE)
    sourceQuestion = ForeignKey(QuestionBank, on_delete=CASCADE)
    questionScore = models.PositiveIntegerField(verbose_name="题目分值", default=0)


class AnswerSheet(models.Model):
    sourcePaper = ForeignKey("AnsweredPaper", on_delete=CASCADE)
    sourceQuestion = ForeignKey("QuestionBank", on_delete=CASCADE)
    selectedOption = ForeignKey(
        "QuestionOption", on_delete=CASCADE, related_name="selectedOption"
    )
