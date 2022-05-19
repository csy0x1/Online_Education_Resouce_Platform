from __future__ import print_function

import base64
import json
import os
import tempfile
import datetime
from distutils.filelist import FileList
from http.client import HTTPResponse
from django.dispatch import receiver

import magic
import OERP.settings
import pytz
from django.contrib.auth import hashers, authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django_comments.signals import comment_was_posted
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.core.exceptions import ObjectDoesNotExist
from django.core.files import File
from django.db import transaction
from django.db.models import F, Q
from django.http import HttpResponseRedirect
from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.template.loader import render_to_string
from django.urls import reverse
from pyexpat import model
from pytz import timezone

from django_comments.models import Comment as CommentModel

from . import forms, models
from .functions import viewFunction as VF

# Create your views here.


def index(request):
    rootlist, dict = VF.Get_Category()
    Cate = {}
    moreCate = {}
    i = 0
    print(Cate)
    for key, value in dict.items():
        if i < 8:
            Cate[key] = value
        else:
            moreCate[key] = value
        i += 1
    print(Cate)
    print(moreCate)
    (
        userCount,
        newestUser,
        courseCount,
    ) = VF.Get_Website_Info().values()  # locals()以字典形式返回所有局部变量，要用values()取出值，否则获取的为key
    recommendCourses = VF.Get_Recommend_Courses()
    # testjson = json.dumps(testjson)    #向JSONfield传递json可以直接传dict，不用编码成json
    # VF.test(testjson)
    user = request.user
    return render(request, "index/indexpage.html", locals())


def userLogin(request):
    if request.user.is_authenticated:  # 不允许重复登录
        return redirect("/index/")
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None and user.is_active:
            login(request, user)
            return redirect("/index/")
            pass
        else:
            print("error")
        # message = "请检查输入的内容"
        # nextUrl = request.session.get("next", None)  # 获取跳转链接，登录后跳转回登录前的页面
        # if username.strip() and password:  # 确保用户名和密码不为空
        #     pass  # 做合法性检测
        #     try:
        #         user = models.Users.objects.get(name=username)
        #     except:  # 出错
        #         message = "用户不存在!"
        #         return render(request, "index/login.html", {"message": message})
        #     if hashers.check_password(password, user.password):
        #         request.session["is_login"] = True
        #         request.session["user_id"] = user.id
        #         request.session["user_name"] = user.name
        #         request.session["avatar"] = user.profile_picture.url
        #         # request.session.set_expiry(0)
        #         # print(user.profile_picture.url)
        #         if nextUrl:
        #             return redirect(nextUrl)
        #         else:
        #             return redirect("/index/")
        #     else:
        #         message = "密码错误!"
        #         return render(request, "index/login.html", {"message": message})
        # else:  # 输入内容有误
        #     return render(request, "index/login.html", {"message": message})
    return render(request, "index/login.html")


def register(request):
    if request.session.get("is_login", None):
        return redirect("/index/")

    if request.method == "POST":
        message = "请检查输入的内容"
        reg_form = forms.userForm(request.POST)
        if reg_form.is_valid():
            username = reg_form.cleaned_data.get("username")
            password = reg_form.cleaned_data.get("password")
            re_password = reg_form.cleaned_data.get("re_password")
            email = reg_form.cleaned_data.get("email")
            captcha = reg_form.cleaned_data.get("captcha")

            # tempuser = models.Users.objects.filter(name=username)
            # tempmail = models.Users.objects.filter(email=email)
            # print(tempuser, tempmail)
            # if tempuser:
            #     print("1")
            #     message = "用户名已被注册"
            #     return render(request, "index/register.html", locals())
            # if tempmail:
            #     print("2")
            #     message = "邮箱已被注册"
            #     return render(request, "index/register.html", locals())
            # if password != re_password:
            #     message = "两次输入的密码不一致"
            #     return render(request, "index/register.html", locals())
            # else:
            # new_user = models.Users()
            # new_user.name = username
            # new_user.password = hashers.make_password(
            #     re_password, None, "pbkdf2_sha256"
            # )
            # new_user.email = email
            # new_user.save()
            models.Users.objects.create_user(
                username=username, password=re_password, email=email
            )
            return redirect("/login/")
        else:
            return render(request, "index/register.html", locals())

    reg_form = forms.userForm()
    return render(request, "index/register.html", locals())


def userLogout(request):
    if not request.user.is_authenticated:
        return redirect("/login/")
    logout(request)
    return render(request, "index/info.html")


@login_required()
def settings(request):
    if request.method == "POST":
        set_Form = forms.settingForm(request.POST)
        real_name = set_Form.cleaned_data.get("realname")
        e_mail = set_Form.cleaned_data.get("email")
        phone_number = set_Form.cleaned_data.get("phone_number")
        gender = set_Form.cleaned_data.get("gender")

    return render(request, "index/setting.html")


@login_required()
def profile(request):
    user = request.user
    # user = models.Users.objects.get(name=request.session["user_name"])
    profileForm = forms.settingForm(instance=user)
    return render(request, "index/profile.html", locals())


@login_required()
def avatar(request):
    user = request.user
    # user = models.Users.objects.get(name=request.session["user_name"])
    profileForm = forms.settingForm(instance=user)
    avatar = user.profile_picture.url
    return render(request, "index/avatar.html", locals())


def aboutus(request):
    return render(request, "index/aboutus.html")


def getTitle(children):
    Title = children[0]["title"]
    try:
        Children = children[0]["children"]
    except:
        Children = "null"
    return Title, Children


def courseInfo(request, courseid):
    courseDetail, courseInfo, teacher, AssistantTeacher = VF.Get_Course(courseid)
    isSignedUp = False
    course = models.Course.objects.get(id=courseid)
    try:
        # username = request.session["user_name"]
        user = request.user  # filter返回Queryset对象
        access = user.access  # 获取用户权限
        if course in user.selected_courses.all():  # 使用exists方法判断该用户是否已选择该课程
            isSignedUp = True
        else:
            # do other thing
            pass
    except:
        isLogin = False

    return render(request, "index/courseInfo.html", locals())


@login_required()
def SignUp(request, courseid):
    isSignUp = request.POST.get("isSignUp")
    if isSignUp:
        user = request.user
        course = models.Course.objects.get(id=courseid)
        # user = models.Users.objects.get(name=username)
        user.selected_courses.add(course.id)
        # 应修改：User表中已选课程的字段类型不应为Charfield, 应为关系类型字段，应该是多对多(checked)
        course.Stu_Count = F("Stu_Count") + 1  # 用F表达式增加报名人数
        # 使用它可以直接引用模型字段的值并执行数据库操作而不用把它们导入到python的内存中。
        user.save()
        course.save()
        message = "报名成功"
    return HttpResponse(message)


@login_required()
def Resign(request, courseid):
    isResign = request.POST.get("isResign")
    if isResign:
        user = request.user
        course = models.Course.objects.get(id=courseid)
        # user = models.Users.objects.get(name=username)
        user.selected_courses.remove(course.id)
        course.Stu_Count = F("Stu_Count") - 1
        user.save()
        course.save()
        message = "退课成功"
    return HttpResponse(message)


@login_required()
def courseSetting(request, courseid):
    user = request.user
    if not user.is_authenticated:
        nextUrl = request.path
        request.session["next"] = nextUrl
        return redirect("/login?next=%s" % nextUrl)
    else:
        courseDetail, _, _, _ = VF.Get_Course(courseid)
        course = models.Course.objects.get(id=courseid)
        categories = models.CourseCategory.objects.all()
        img = course.Course_Img
        # user = models.Users.objects.get(name=username)
        if user != course.Course_Teacher and user not in course.Assistant_Teacher.all():
            # return HttpResponseRedirect(reverse("index:index",))
            return render(request, "index/courseSettingError.html")
        if request.method == "POST":
            operationType = request.POST.get("operationType")
            # if operationType == "uploadImage":
            #     file = request.FILES.get("input-CourseImage")
            #     print("file is : ")
            #     print(file)
            #     try:
            #         course.Course_Img = file
            #         course.save()
            #     except Exception as e:
            #         print(e)
            #         return JsonResponse({"status": "error"})
            #     return JsonResponse({"status": "success"})
            if operationType == "submitForm":
                formData = request.POST.getlist("form[]")
                print(len(formData))
                try:
                    course.Course_Name = formData[0]
                    course.Course_Info = formData[1]
                    course.Course_Goal = formData[2]
                    course.Grade_Requirements = formData[3]
                    course.Reference = formData[4]
                    course.QA = formData[5]
                    image = request.POST.get("image")
                    if len(image) != 0:
                        try:
                            f_obj = image.split(",")[
                                1
                            ]  # 前端传过来BASE64编码的图片，需去掉"data:image/jpeg;base64,"
                            decodedimg = base64.b64decode(f_obj)  # 将BASE64编码的图片解码
                            filepath = (
                                "Course_Img/"
                                + course.Course_Name.replace(" ", "_")
                                + str(courseid)
                                + ".jpg"
                            )
                            absolute_filepath = os.path.join(
                                OERP.settings.MEDIA_ROOT, filepath
                            )
                            with open(absolute_filepath, "wb") as f:
                                f.write(decodedimg)
                            course.Course_Img = filepath
                            course.save()
                        except Exception as e:
                            print(e)
                            return JsonResponse({"status": "error"})
                    category_obj = models.CourseCategory.objects.get(
                        CategoryName=formData[6]
                    )
                    course.Course_Category = category_obj
                    timezone = pytz.timezone("Asia/Shanghai")
                    dateTime = datetime.datetime.strptime(formData[7], "%Y-%m-%d %H:%M")
                    course.Ending_Time = timezone.localize(dateTime)
                    course.save()
                    return JsonResponse({"status": "success"})
                except Exception as e:
                    print(e)
                    return JsonResponse({"status": "error"})

    return render(request, "index/courseSettingInfo.html", locals())


@login_required()
def courseSettingStudent(request, courseid):
    courseDetail, _, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    students = course.students.all()
    return render(request, "index/courseSettingStudent.html", locals())


@login_required()
def courseSettingNotice(request, courseid):
    courseDetail, _, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    # noticeForm = forms.NoticeForm()
    historyNotices = models.CourseNotice.objects.filter(sourceCourse=course)
    if request.method == "POST":
        title = request.POST["NoticeTitle"]
        content = request.POST["NoticeContent"]
        instance = models.CourseNotice(
            sourceCourse=course, Title=title, Message=content
        )
        instance.save()
        return HttpResponse("succeed")
    return render(request, "index/courseSettingNotice.html", locals())


@login_required()
def courseSettingChapter(request, courseid):
    courseDetail, _, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    Chapters = models.Chapter.objects.filter(sourceCourse=course)
    # FilesList = models.CourseFiles.objects.filter(sourceSection=Section)

    # if request.method == "POST":
    #     POSTsection = request.POST.get("section")
    #     Section = models.Section.objects.get(sectionName__startswith=POSTsection)
    #     FilesForm = forms.CourseFilesForm(request.POST, request.FILES)
    #     files = request.FILES.getlist("file_obj")
    #     print(request.FILES)
    #     if FilesForm.is_valid():
    #         for file in files:
    #             file_instance = models.CourseFiles(
    #                 courseFile=file, sourceSection=Section
    #             )
    #             file_instance.save()
    #             j={}
    #             return JsonResponse({'status':'success'})
    # else:
    #     FilesForm = forms.CourseFilesForm()

    if request.method == "POST":
        operationType = request.POST.get("operationType")
        if operationType == "upload":
            file = request.FILES["input-CourseFiles"]
            tmpfile = tempfile.NamedTemporaryFile(delete=False)
            with tmpfile as tmp:
                for chunk in file.chunks():
                    tmp.write(chunk)
                print(magic.from_file(tmp.name, mime=True))
            section = request.POST.get("section")
            # file_path = "courseFile/"+course.Course_Name+"/"+chapter+"/"+section+"/"+file.name
            # os.makedirs(os.path.dirname(file_path), exist_ok=True)
            # with open(file_path,"wb") as f:
            # for chunk in file.chunks():
            #     file.write(chunk)
            section_obj = models.Section.objects.get(sectionName=section)
            instance = models.CourseFiles(sourceSection=section_obj, courseFile=file)
            instance.save()
            return JsonResponse({"status": "success"})
        elif operationType == "delete":
            files = request.POST.getlist("files[]")
            chapter = request.POST.get("chapter")
            section = request.POST.get("section")
            for file in files:
                file_path = (
                    "courseFile/"
                    + course.Course_Name
                    + "/"
                    + chapter
                    + "/"
                    + section
                    + "/"
                    + file
                )
                file_obj = models.CourseFiles.objects.filter(courseFile=file_path)
                for f in file_obj:
                    try:
                        VF.delete_Files(f.courseFile.path)
                        f.delete()
                    except (FileNotFoundError, Exception) as e:
                        return JsonResponse({"status": "error"})
            return JsonResponse({"status": "success"})
    return render(request, "index/courseSettingChapter.html", locals())


@login_required()
def postNotice(request, courseid):
    course = models.Course.objects.get(id=courseid)
    if request.method == "POST":
        title = request.POST["NoticeTitle"]
        content = request.POST["content"]
        instance = models.CourseNotice(
            sourceCourse=course, Title=title, Message=content
        )
        instance.save()
    return HttpResponse("succeed")


@login_required()
def deleteNotice(request, courseid):
    List = request.POST.getlist("announcementList")
    print(List)
    for item in List:
        models.CourseNotice.objects.filter(id=item).delete()
    return HttpResponse("succeed")


@login_required()
def saveNode(request, courseid):  # 保存节点，测试通过，待重构
    course = models.Course.objects.get(id=courseid)
    dict = request.POST.get("dict")  # 获取树状图的数据
    course.Course_Chapter = dict
    course.save()
    chapterDict = VF.get_Chapter(dict)
    VF.save_Chapter(chapterDict, courseid)
    return HttpResponse(dict)


@login_required()
def getNode(request, courseid):  # 读取节点，生成章节树状图
    course = models.Course.objects.filter(id=courseid)
    Chapter_Tree = course[0].Course_Chapter
    return HttpResponse(Chapter_Tree)


@login_required()
def removeStudents(request, courseid):
    studentsList = request.POST.getlist("studentsList")
    course = models.Course.objects.get(id=courseid)
    for student in studentsList:
        stu = models.Users.objects.get(username=student)
        course.students.remove(stu.id)
        course.save()
    return HttpResponse("succeed")


@login_required()
def courseLearn(request, courseid):
    return HttpResponseRedirect(reverse("index:Notice", args=(courseid,)))


@login_required()
def courseLearnNotice(request, courseid):
    courseDetail, _, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    historyNotices = models.CourseNotice.objects.filter(sourceCourse=course)
    if len(historyNotices) == 0:
        pass
        # newestNotice = models.CourseNotice.objects.get(sourceCourse=None)
    else:
        newestNotice = historyNotices.order_by("-createTime")[:1][0]
    paginator = Paginator(historyNotices, 5)  # 分页功能
    if request.method == "GET":
        page = request.GET.get("page")
        try:
            Notices = paginator.page(page)
        except PageNotAnInteger:
            Notices = paginator.page(1)
        except EmptyPage:
            Notices = paginator.page(paginator.num_pages)
    return render(request, "index/courseLearn/courseLearnNotice.html", locals())


@login_required()
def courseLearnGrading(request, courseid):
    courseDetail, _, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    return render(request, "index/courseLearn/courseLearnGrading.html", locals())


@login_required()
def courseLearnContent(request, courseid):
    courseDetail, _, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    Chapters = models.Chapter.objects.filter(sourceCourse=course)
    page = request.GET.get("page")
    # Section = models.Section.objects.get(sectionName="1.1 sb Bot2")
    # FilesForm = forms.CourseFilesForm()
    # FilesList = models.CourseFiles.objects.filter(sourceSection=Section)

    # if request.method == "POST":
    #     FilesForm = forms.CourseFilesForm(request.POST, request.FILES)
    #     files = request.FILES.getlist("courseFile")
    #     if FilesForm.is_valid():
    #         for file in files:
    #             file_instance = models.CourseFiles(
    #                 courseFile=file, sourceSection=Section
    #             )
    #             file_instance.save()
    return render(request, "index/courseLearn/courseLearnContent.html", locals())


@login_required()
def courseLearnExercise(request, courseid):
    courseDetail, _, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    user = request.user
    # user = models.Users.objects.get(name=request.session["user_name"])
    PaperList = models.Paper.objects.filter(sourceCourse=course, PaperType=False)
    Paper_Status = VF.get_Paper_Status(user, PaperList)
    html = render_to_string("index/AjaxTemplate/ExerciseOverview.html", locals())
    if request.GET.get("Return") == "true":
        return JsonResponse(html, safe=False)
    return render(request, "index/courseLearn/courseLearnExercise.html", locals())


@login_required()
def exerciseGetPaper(request, courseid):
    courseDetail, _, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    paper = models.Paper.objects.get(id=request.GET.get("paperID"))
    user = request.user
    # user = models.Users.objects.get(name=request.session["user_name"])
    try:
        AnsweredPaper = models.AnsweredPaper.objects.get(
            sourcePaper=paper, candidates=user
        )
        Answersheet = AnsweredPaper.Answersheet.all()
    except ObjectDoesNotExist as e:
        Answersheet = {}
    html = render_to_string("index/AjaxTemplate/ExercisePreview.html", locals())
    # html = render_to_string("index/AjaxTemplate/ExamPage.html", locals())
    # return render(request, "index/AjaxTemplate/PaperDetail.html", locals())
    return JsonResponse(html, safe=False)


@login_required()
def startExam(request, courseid):
    courseDetail, _, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    paper = models.Paper.objects.get(id=request.GET.get("paperID"))
    user = request.user
    # user = models.Users.objects.get(name=request.session["user_name"])
    try:
        AnsweredPaper = models.AnsweredPaper.objects.filter(
            sourcePaper=paper, candidates=user
        )
        EndTime = AnsweredPaper[0].EndTime.isoformat()
        if AnsweredPaper[0].is_finished:
            response = JsonResponse({"status": "Forbidden"}, safe=False)
            response.status_code = 403
            return response
    except (ObjectDoesNotExist, IndexError):
        with transaction.atomic():
            datetimenow = datetime.datetime.now()
            instance = models.AnsweredPaper(
                sourcePaper=paper,
                candidates=user,
                StartTime=datetimenow,
                EndTime=datetimenow
                + datetime.timedelta(
                    hours=paper.ExaminationTime.hour,
                    minutes=paper.ExaminationTime.minute,
                    seconds=paper.ExaminationTime.second,
                ),
            )
            instance.save()
            EndTime = instance.EndTime.isoformat()
    html = render_to_string("index/AjaxTemplate/ExamPage.html", locals())
    return JsonResponse(html, safe=False)


# 考试完成提交答案
@login_required()
def submitPaper(request, courseid):
    courseDetail, _, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    if request.method == "POST":
        PaperID = request.POST.get("PaperID")
        paper = models.Paper.objects.get(id=PaperID)
        AnswerSheet = json.loads(request.POST.get("AnswerSheet"))
        user = request.user
        # user = models.Users.objects.get(name=request.session["user_name"])
        # print(PaperID)
        # print(AnswerSheet)  # {"14":"4","21":"6","22":"6","83":"24"}
        # print(user)
        with transaction.atomic():
            answeredPaperInstance = models.AnsweredPaper.objects.get(
                sourcePaper=paper, candidates=user
            )
            for optionID, questionID in AnswerSheet.items():
                optionInstance = models.QuestionOption.objects.get(id=optionID)
                questionInstance = models.QuestionBank.objects.get(id=questionID)
                answeredPaperInstance.Answersheet.add(
                    optionInstance,
                    through_defaults={"sourceQuestion": questionInstance},
                )
            answeredPaperInstance.is_finished = True
            answeredPaperInstance.save()

        return JsonResponse({"status": "success"})


@login_required()
def courseLearnExamination(request, courseid):
    courseDetail, _, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    user = request.user
    # user = models.Users.objects.get(name=request.session["user_name"])
    PaperList = models.Paper.objects.filter(sourceCourse=course, PaperType=True)
    Paper_Status = VF.get_Paper_Status(user, PaperList)
    html = render_to_string("index/AjaxTemplate/ExerciseOverview.html", locals())
    if request.GET.get("Return") == "true":
        return JsonResponse(html, safe=False)
    return render(request, "index/courseLearn/courseLearnExamination.html", locals())


@login_required()
def courseLearnComment(request, courseid):
    courseDetail, _, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    user = request.user
    CommentsList = CommentModel.objects.filter(object_pk=courseid).reverse()
    paginator = Paginator(CommentsList, 5)  # 分页功能
    if request.method == "GET":
        page = request.GET.get("page")
        try:
            Comments = paginator.page(page)
        except PageNotAnInteger:
            Comments = paginator.page(1)
        except EmptyPage:
            Comments = paginator.page(paginator.num_pages)
    # user = models.Users.objects.get(name=request.session["user_name"])
    return render(request, "index/courseLearn/courseLearnComment.html", locals())


@login_required()
def GetSection(request, courseid):
    Chapter = request.GET.get("Chapter")
    Chapter = models.Chapter.objects.get(chapterName=Chapter)
    data = []
    Sections = Chapter.sourceChapter.all()
    for Section in Sections:
        data.append(Section.sectionName)

    return JsonResponse(data, safe=False)


@login_required()
def GetContent(request, courseid):
    Section = request.POST.get("Section")
    operation = request.POST.get("Operation")
    previewFile = request.POST.get("file")
    Section = models.Section.objects.get(sectionName__startswith=Section)
    FilesList = models.CourseFiles.objects.filter(sourceSection=Section)
    data = {}
    videos = []
    html = ""
    for f in FilesList:
        filename = f.filename()
        tmpfile = tempfile.NamedTemporaryFile(delete=False)
        with tmpfile as tmp:
            for chunk in f.courseFile.open("rb").chunks():
                tmp.write(chunk)
            if magic.from_file(tmp.name, mime=True).split("/")[0] == "video":
                videos.append(f)
                data[filename] = f.courseFile.url
            else:
                data[filename] = f.courseFile.url
    if previewFile != None and FileList != None:
        video = videos[int(previewFile)]
    elif len(videos) == 0:
        video = None
    else:
        video = videos[0]
    html = render_to_string("index/AjaxTemplate/CourseFilePreview.html", locals())
    if operation == "Preview":  # 课程学习界面的文件列表
        return JsonResponse(html, safe=False)
    else:  # 课程设置界面的文件列表
        return JsonResponse(data, safe=False)


def categoryPage(request, categoryID):
    category = models.CourseCategory.objects.get(CategoryID=categoryID)
    subCategories = models.CourseCategory.objects.filter(ParentID=categoryID)
    if request.method == "GET":
        cateID = request.GET.get("subcategory")
        if cateID == None:
            courses = VF.get_Courses_By_Category(categoryID)
        else:
            courses = VF.get_Courses_By_Category(cateID)
    return render(request, "index/courseCategory/courseCategoryIndex.html", locals())


@login_required()
def getQuestionBank(request, courseid):
    course = models.Course.objects.get(id=courseid)
    QuestionBankData = VF.get_QuestionBank(course)
    if request.method == "POST":
        operationType = request.POST.get("operationType")
        if operationType == "delete":
            deleteRow = json.loads(request.POST.get("deleteRow"))
            try:
                deleteQuestion = models.QuestionBank.objects.get(
                    id=deleteRow["QuestionID"]
                )
                # deleteQuestion.delete()
            except Exception as e:
                print(e)
                return JsonResponse("failed", safe=False)
            return JsonResponse("success", safe=False)
    return JsonResponse(QuestionBankData, safe=False)


@login_required()
def courseSettingQuestionBank(request, courseid):
    courseDetail, _, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    VF.get_QuestionBank(course)
    if request.method == "POST":  # 保存题库
        operationType = request.POST.get("operationType")
        if operationType == "create":
            VF.questionBankImport(request, course)
            QuestionBankData = VF.get_QuestionBank(course)
            return JsonResponse(QuestionBankData, safe=False)
        elif operationType == "preview":
            QuestionBankData = VF.get_QuestionBank(course)
            return JsonResponse(QuestionBankData, safe=False)

    return render(
        request, "index/ExaminationPages/questionBankManagement.html", locals()
    )


@login_required()
def courseSettingCreatePaper(request, courseid):
    courseDetail, _, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    html = render_to_string("index/AjaxTemplate/CreatePaper.html")
    if request.method == "POST":
        try:
            PaperInfo = json.loads(request.POST.get("PaperInfo"))
            SelectedQuestion = json.loads(request.POST.get("SelectedQuestion"))

            timezone = pytz.timezone("Asia/Shanghai")

            dateTime = datetime.datetime.strptime(
                PaperInfo["StartTime"], "%Y-%m-%d %H:%M"
            )
            StartTime = timezone.localize(dateTime)

            dateTime = datetime.datetime.strptime(
                PaperInfo["EndTime"], "%Y-%m-%d %H:%M"
            )
            EndTime = timezone.localize(dateTime)

            if PaperInfo["PaperType"] == "考试":
                PaperInfo["PaperType"] = True
            else:
                PaperInfo["PaperType"] = False

            with transaction.atomic():
                instance_Paper = models.Paper(
                    sourceCourse=course,
                    PaperName=PaperInfo["PaperName"],
                    PaperType=PaperInfo["PaperType"],
                    ExaminationTime=PaperInfo["Duration"],
                    StartTime=StartTime,
                    EndTime=EndTime,
                )
                instance_Paper.save()
                for key, value in SelectedQuestion.items():
                    Question = models.QuestionBank.objects.get(id=key)
                    instance_Paper.includedQuestions.add(
                        Question,
                        through_defaults={"questionScore": value},
                    )
                    Question.ReferenceCount = F("ReferenceCount") + 1
                    Question.save()
            return JsonResponse("success", safe=False)
        except Exception as e:
            print(e)
            response = JsonResponse(str(e), safe=False)
            response.status_code = 404
            return response
    return JsonResponse(html, safe=False)


@login_required()
def courseSettingPaperManagement(request, courseid):
    courseDetail, _, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    PaperList = models.Paper.objects.filter(sourceCourse=course)
    html = render_to_string("index/AjaxTemplate/PaperOverview.html", locals())
    if request.GET.get("Return") == "true":
        return JsonResponse(html, safe=False)
    return render(request, "index/ExaminationPages/paperManagement.html", locals())


@login_required()
def getPaper(request, courseid):
    courseDetail, _, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    paper = models.Paper.objects.get(id=request.GET.get("paperID"))
    html = render_to_string("index/AjaxTemplate/PaperDetail.html", locals())
    # return render(request, "index/AjaxTemplate/PaperDetail.html", locals())
    return JsonResponse(html, safe=False)


@login_required()
def deletePaper(request, courseid):
    courseDetail, _, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    PaperList = models.Paper.objects.filter(sourceCourse=course)
    try:
        with transaction.atomic():
            paper = models.Paper.objects.get(id=request.GET.get("paperID"))
            paper.delete()
    except Exception as e:
        print(e)
        response = JsonResponse("发生错误", safe=False)
        response.status_code = 404
        return response
    html = render_to_string("index/AjaxTemplate/PaperOverview.html", locals())
    return JsonResponse(html, safe=False)
