import datetime
from lib2to3.pgen2.token import OP
from optparse import Option
import os

from django.db.models.base import Model

from .. import models
from rest_framework import serializers
from datetime import datetime
from notifications.signals import notify
from django.contrib.auth.models import User
from django.db.models import Q

import index, json


def Get_Category():  # 获取分类信息
    root = models.CourseCategory.objects.filter(Is_Root=True).order_by("DisplayOrder")
    rootlist = []
    dict = {}
    for i in range(root.count()):
        Child = models.CourseCategory.objects.filter(
            ParentID=root[i].CategoryID
        ).order_by("DisplayOrder")
        ChildCategory = []
        for j in range(Child.count()):
            ChildCategory.append(Child[j])
        rootlist.append(root[i])
        dict[root[i]] = ChildCategory
    return rootlist, dict


def Get_Website_Info():  # 获取网站统计数据
    userCount = models.Users.objects.all().count()
    newestUser = models.Users.objects.latest("create_time")
    courseCount = models.Course.objects.all().count()
    return locals()  # locals()以字典形式返回所有局部变量


def Get_Course(courseid):  # 获取课程信息
    object = models.Course.objects.get(pk=courseid)
    # 格式化器
    class CourseDetailSerializer(
        serializers.ModelSerializer
    ):  # https://stackoverflow.com/questions/21925671/convert-django-model-object-to-dict-with-all-of-the-fields-intact
        class Meta:
            model = models.Course
            fields = "__all__"

    class CourseInfoSerializer(serializers.ModelSerializer):
        class Meta:
            model = models.Course
            fields = [
                "Course_Info",
                "Course_Goal",
                "Course_Chapter",
                "Grade_Requirements",
                "Reference",
                "QA",
                # "Starting_Time",
                # "Ending_Time",
            ]

    courseDetail = CourseDetailSerializer(object).data
    try:
        courseDetail["Course_Category"] = models.CourseCategory.objects.get(
            pk=courseDetail["Course_Category"]
        )  # 格式化器只获取了外键的ID，要通过ID再获取外键的数值
        teacher = models.Users.objects.get(pk=courseDetail["Course_Teacher"])
        courseDetail["Course_Teacher"] = models.Users.objects.get(
            pk=courseDetail["Course_Teacher"]
        )  # 格式化器只获取了外键的ID，要通过ID再获取外键的数值
    except:
        pass
    courseInfo = CourseInfoSerializer(object).data
    courseInfo["课程说明"] = courseInfo.pop("Course_Info")
    courseInfo["课程目标"] = courseInfo.pop("Course_Goal")
    courseInfo["课程大纲"] = courseInfo.pop("Course_Chapter")
    courseInfo["成绩要求"] = courseInfo.pop("Grade_Requirements")
    courseInfo["参考资料"] = courseInfo.pop("Reference")
    courseInfo["常见问题"] = courseInfo.pop("QA")
    # 将时间格式从TZ格式(2021-04-26T22:55:09.695785+08:00)转换成datetime对象再转换成字符串格式输出
    # https://stackoverflow.com/questions/13182075/how-to-convert-a-timezone-aware-string-to-datetime-in-python-without-dateutil
    courseDetail["Starting_Time"] = (
        datetime.fromisoformat(courseDetail["Starting_Time"])
        .strftime("%Y{y}%m{m}%d{d} %H:%M")
        .format(y="年", m="月", d="日")
    )
    courseDetail["Ending_Time"] = (
        datetime.fromisoformat(courseDetail["Ending_Time"])
        .strftime("%Y{y}%m{m}%d{d} %H:%M")
        .format(y="年", m="月", d="日")
    )

    return courseDetail, courseInfo, teacher


def Get_Recommend_Courses():  # 获取课程排行信息
    recommendCourses = models.Course.objects.all().order_by("-Stu_Count")[:5]
    return recommendCourses


def checkLogin(request):
    loginStatus = request.session.get("is_login")
    if loginStatus:
        return True
    else:
        return False


def get_Chapter(dict):

    chapterDict = {}  # 存储最终的章节结构
    dict = json.loads(dict)

    def getChildren(key, value):  # 获取子节点
        if key == "children":
            return value
        else:
            pass

    for key, value in dict.items():  # 剔除root节点
        Chapter = getChildren(key, value)

    for i in range(len(Chapter)):
        if "children" in Chapter[i]:  # 如果存在键"children"，则准备存储其拥有的节
            for key, value in Chapter[i].items():
                chapterDict[Chapter[i]["title"]] = []  # 以该章的标题创建一个键值对
                if key == "children":  # 获取该章所拥有的节
                    Section = getChildren(key, value)
                    for j in range(len(Section)):  # 将每节的标题添加到所属章的键值对中。
                        chapterDict[Chapter[i]["title"]].append(Section[j]["title"])
        else:  # 若不存在键"children"，则存储空白的键值对
            chapterDict[Chapter[i]["title"]] = []

    return chapterDict


def save_Chapter(chapterDict, courseid):  # 存储章节结构
    models.Chapter.objects.filter(sourceCourse=courseid).delete()
    course = models.Course.objects.get(id=courseid)
    for Chapter, Section in chapterDict.items():
        chapterdb = models.Chapter.objects.create(
            sourceCourse=course, chapterName=Chapter
        )
        for i in range(len(Section)):
            sectiondb = models.Section.objects.create(
                sourceChapter=chapterdb, sectionName=Section[i]
            )


def delete_Files(filepath):
    if os.path.exists(filepath):
        try:
            os.remove(filepath)
        except Exception as e:
            print(e)
            raise e
    else:
        raise FileNotFoundError("文件不存在")


# def test(Chapter):
#     course = models.Course.objects.create(Course_Name='1',Course_Teacher='1',Course_Info='1',Stu_Count=1,Course_Chapter=Chapter,View_Count=1,Ending_Time=datetime.datetime.now())


def get_Courses_By_Category(CategoryID):
    Categories_Queryset = models.CourseCategory.objects.filter(
        Q(CategoryID=CategoryID) | Q(ParentID=CategoryID)
    )
    Course_Queryset = models.Course.objects.filter(
        Course_Category__in=Categories_Queryset
    )
    return Course_Queryset


def createQuestion(course, value):
    value = value[1:]
    try:
        if value[3] == "公开":
            value[3] = True
        else:
            value[3] = False

        instance = models.QuestionBank(
            sourceCourse=course,
            QuestionName=value[0],
            QuestionType=value[1],
            QuestionScore=value[2],
            PublicRelease=value[3],
        )
        print(instance)
        return instance
        # instance.save()
    except Exception as e:
        print(e)
        return False


def createAnswer(instance, optionInstance):
    try:
        answerInstance = models.QuestionAnswer(
            sourceQuestion=instance,
            Answer=optionInstance,
        )
        return answerInstance
    except Exception as e:
        print(e)
        return False


def createOptions(instance, Index, Value):
    # options = {'0': {'asd': False, 'eewe': False, 'ssd': False, 'd': False}, '1': {'': False}, '2': {'': False}}
    try:
        optionInstance = models.QuestionOption(
            sourceQuestion=instance,
            OptionName=Index,
        )
        if Value == True:
            answerInstance = createAnswer(instance, optionInstance)
            instance.save()
            optionInstance.save()
            answerInstance.save()
        else:
            instance.save()
            optionInstance.save()
        return True
    except Exception as e:
        print(e)
        return False


def questionBankImport(request, course):  # 导入题库
    data = request.POST.get("data")
    options = request.POST.get("options")
    data = json.loads(data)  # loads将json字符串转换成python数据结构，dumps是将python数据结构转换成json字符串
    options = json.loads(options)
    for cIndex, cValue in data.items():
        instance = createQuestion(course, cValue)
        for oIndex, oValue in options[cIndex].items():
            createOptions(instance, oIndex, oValue)


"""
{
    "name":
    "type":
    "score":
    "refercount":
    "publicrelease":
    "sourcecourse":
    "option":{
        "answer":"option"
    }


}
"""


def get_QuestionBank(course):
    QuestionBankData = []
    Question_Queryset = models.QuestionBank.objects.filter(
        Q(sourceCourse=course) | Q(PublicRelease=True)
    )
    counter = 0
    for question in Question_Queryset:
        counter = counter + 1
        questionData = {}
        optionsData = {}
        questionData["Index"] = counter
        questionData["QuestionID"] = question.id
        questionData["QuestionName"] = question.QuestionName
        questionData["QuestionType"] = question.QuestionType
        questionData["QuestionScore"] = question.QuestionScore
        questionData["PublicRelease"] = question.PublicRelease
        questionData["ReferenceCount"] = question.ReferenceCount
        Options = question.optionSourceQuestion.all()
        Answers = question.answerSourceQuestion.all()
        for option in Options:
            for answer in Answers:
                if answer.Answer == option:
                    optionsData[option.OptionName] = True
                    break
                else:
                    optionsData[option.OptionName] = False
        questionData["Option"] = optionsData
        QuestionBankData.append(questionData)
        data = {}
        data["data"] = QuestionBankData
    return data
