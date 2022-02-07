from __future__ import print_function

from django.contrib.auth import hashers
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.db.models import F
from django.http import HttpResponseRedirect
from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.urls import reverse

from . import forms, models
from .functions import viewFunction as VF

# Create your views here.


def index(request):
    rootlist, dict = VF.Get_Category()
    (
        userCount,
        newestUser,
        courseCount,
    ) = VF.Get_Website_Info().values()  # locals()以字典形式返回所有局部变量，要用values()取出值，否则获取的为key
    recommendCourses = VF.Get_Recommend_Courses()
    # testjson = json.dumps(testjson)    #向JSONfield传递json可以直接传dict，不用编码成json
    # VF.test(testjson)
    return render(request, "index/indexpage.html", locals())


def login(request):
    if request.session.get("is_login", None):  # 不允许重复登录
        return redirect("/index/")
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        message = "请检查输入的内容"
        nextUrl = request.session.get("next", None)  # 获取跳转链接，登录后跳转回登录前的页面
        if username.strip() and password:  # 确保用户名和密码不为空
            pass  # 做合法性检测
            try:
                user = models.Users.objects.get(name=username)
            except:  # 出错
                message = "用户不存在!"
                return render(request, "index/login.html", {"message": message})
            if hashers.check_password(password, user.password):
                request.session["is_login"] = True
                request.session["user_id"] = user.id
                request.session["user_name"] = user.name
                request.session["avatar"] = user.profile_picture.url
                # request.session.set_expiry(0)
                # print(user.profile_picture.url)
                if nextUrl:
                    return redirect(nextUrl)
                else:
                    return redirect("/index/")
            else:
                message = "密码错误!"
                return render(request, "index/login.html", {"message": message})
        else:  # 输入内容有误
            return render(request, "index/login.html", {"message": message})
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

            tempuser = models.Users.objects.filter(name=username)
            tempmail = models.Users.objects.filter(email=email)
            print(tempuser, tempmail)
            if tempuser:
                print("1")
                message = "用户名已被注册"
                return render(request, "index/register.html", locals())
            if tempmail:
                print("2")
                message = "邮箱已被注册"
                return render(request, "index/register.html", locals())
            if password != re_password:
                message = "两次输入的密码不一致"
                return render(request, "index/register.html", locals())
            else:
                new_user = models.Users()
                new_user.name = username
                new_user.password = hashers.make_password(
                    re_password, None, "pbkdf2_sha256"
                )
                new_user.email = email
                new_user.save()
                return redirect("/login/")
        else:
            return render(request, "index/register.html", locals())

    reg_form = forms.userForm()
    return render(request, "index/register.html", locals())


def logout(request):
    if not request.session.get("is_login", None):
        return redirect("/login/")
    request.session.flush()
    return render(request, "index/info.html")


def settings(request):
    if request.method == "POST":
        set_Form = forms.settingForm(request.POST)
        real_name = set_Form.cleaned_data.get("realname")
        e_mail = set_Form.cleaned_data.get("email")
        phone_number = set_Form.cleaned_data.get("phone_number")
        gender = set_Form.cleaned_data.get("gender")

    return render(request, "index/setting.html")


def profile(request):
    user = models.Users.objects.get(name=request.session["user_name"])
    profileForm = forms.settingForm(instance=user)
    return render(request, "index/profile.html", locals())


def avatar(request):
    user = models.Users.objects.get(name=request.session["user_name"])
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
    courseDetail, courseInfo, teacher = VF.Get_Course(courseid)
    isSignedUp = False
    try:
        username = request.session["user_name"]
        user = models.Users.objects.filter(name=username)  # filter返回Queryset对象
        access = user[0].access  # 获取用户权限
        isLogin = True
        if user.filter(selected_courses=courseid).exists():  # 使用exists方法判断该用户是否已选择该课程
            isSignedUp = True
        else:
            # do other thing
            pass
    except:
        isLogin = False

    return render(request, "index/courseInfo.html", locals())


def SignUp(request, courseid):
    isSignUp = request.POST.get("isSignUp")
    if isSignUp:
        username = request.session["user_name"]
        course = models.Course.objects.get(id=courseid)
        user = models.Users.objects.get(name=username)
        user.selected_courses.add(course.id)
        # 应修改：User表中已选课程的字段类型不应为Charfield, 应为关系类型字段，应该是多对多(checked)
        course.Stu_Count = F("Stu_Count") + 1  # 用F表达式增加报名人数
        # 使用它可以直接引用模型字段的值并执行数据库操作而不用把它们导入到python的内存中。
        user.save()
        course.save()
        message = "报名成功"
    return HttpResponse(message)


def Resign(request, courseid):
    isResign = request.POST.get("isResign")
    if isResign:
        username = request.session["user_name"]
        course = models.Course.objects.get(id=courseid)
        user = models.Users.objects.get(name=username)
        user.selected_courses.remove(course.id)
        course.Stu_Count = F("Stu_Count") - 1
        user.save()
        course.save()
        message = "退课成功"
    return HttpResponse(message)


def list(request):  # 评论功能测试，无用界面
    # pk=1
    course = models.Course.objects.get(id=1)
    return render(request, "comments/list.html", locals())


def courseSetting(request, courseid):
    if not VF.checkLogin(request):
        nextUrl = request.path
        request.session["next"] = nextUrl
        return redirect("/login?next=%s" % nextUrl)
    else:
        username = request.session["user_name"]
        user = models.Users.objects.get(name=username)
        if user.access != "teacher":
            # return HttpResponseRedirect(reverse("index:index",))
            return render(request, "index/courseSettingError.html")
        courseDetail, _, _ = VF.Get_Course(courseid)
        course = models.Course.objects.get(id=courseid)
        categories = models.CourseCategory.objects.all()
        img = course.Course_Img
        if request.method == "POST":
            settingForm = forms.CourseSettingForm(
                request.POST, request.FILES, instance=course
            )
            if settingForm.is_valid():
                instance = settingForm.save(commit=False)
                instance.save()
                return HttpResponseRedirect(
                    reverse("index:courseSetting", args=(courseid,))
                )
                # 反向解析URL https://www.liujiangblog.com/course/django/136
        else:
            settingForm = forms.CourseSettingForm(instance=course)

    return render(request, "index/courseSettingInfo.html", locals())


def courseSettingStudent(request, courseid):
    courseDetail, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    students = course.students.all()
    return render(request, "index/courseSettingStudent.html", locals())


def courseSettingNotice(request, courseid):
    courseDetail, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    #noticeForm = forms.NoticeForm()
    historyNotices = models.CourseNotice.objects.filter(sourceCourse=course)
    if request.method == "POST":
        title = request.POST['NoticeTitle']
        content = request.POST['NoticeContent']
        instance = models.CourseNotice(sourceCourse=course,Title=title,Message=content)
        instance.save()
        return HttpResponse("succeed")
    return render(request, "index/courseSettingNotice.html", locals())


def courseSettingChapter(request, courseid):
    courseDetail, _, _ = VF.Get_Course(courseid)
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
            file = request.FILES['input-CourseFiles']
            section = request.POST.get('section')
            # file_path = "courseFile/"+course.Course_Name+"/"+chapter+"/"+section+"/"+file.name
            # os.makedirs(os.path.dirname(file_path), exist_ok=True)
            # with open(file_path,"wb") as f:
            # for chunk in file.chunks():
            #     file.write(chunk)
            section_obj = models.Section.objects.get(sectionName=section)
            instance = models.CourseFiles(sourceSection=section_obj,courseFile=file)
            instance.save()
            return JsonResponse({'status':'success'})
        elif operationType == "delete":
            files = request.POST.getlist("files[]")
            chapter = request.POST.get('chapter')
            section = request.POST.get('section')
            for file in files:
                file_path = "courseFile/"+course.Course_Name+"/"+chapter+"/"+section+"/"+file
                file_obj = models.CourseFiles.objects.filter(courseFile=file_path)
                for f in file_obj:
                    try:
                        VF.delete_Files(f.courseFile.path)
                        f.delete()
                    except(FileNotFoundError, Exception) as e:
                        return JsonResponse({'status':'error'})
            return JsonResponse({"status":"success"})
    return render(request, "index/courseSettingChapter.html", locals())


def postNotice(request, courseid):
    course = models.Course.objects.get(id=courseid)
    if request.method == "POST":
        title = request.POST['NoticeTitle']
        content = request.POST['content']
        instance = models.CourseNotice(sourceCourse=course,Title=title,Message=content)
        instance.save()
    return HttpResponse("succeed")


def deleteNotice(request, courseid):
    List = request.POST.getlist("announcementList")
    print(List)
    for item in List:
        models.CourseNotice.objects.filter(id=item).delete()
    return HttpResponse("succeed")


def saveNode(request, courseid):  # 保存节点，测试通过，待重构
    course = models.Course.objects.get(id=courseid)
    dict = request.POST.get("dict")  # 获取树状图的数据
    course.Course_Chapter = dict
    course.save()
    chapterDict = VF.get_Chapter(dict)
    VF.save_Chapter(chapterDict, courseid)
    return HttpResponse(dict)


def getNode(request, courseid):  # 读取节点，生成章节树状图
    course = models.Course.objects.filter(id=courseid)
    Chapter_Tree = course[0].Course_Chapter
    return HttpResponse(Chapter_Tree)


def removeStudents(request, courseid):
    studentsList = request.POST.getlist("studentsList")
    course = models.Course.objects.get(id=courseid)
    for student in studentsList:
        stu = models.Users.objects.get(name=student)
        course.students.remove(stu.id)
        course.save()
    return HttpResponse("succeed")


def courseLearn(request, courseid):
    return HttpResponseRedirect(reverse("index:Notice", args=(courseid,)))


def courseLearnNotice(request, courseid):
    courseDetail, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    historyNotices = models.CourseNotice.objects.filter(sourceCourse=course)
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


def courseLearnGrading(request, courseid):
    courseDetail, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    return render(request, "index/courseLearn/courseLearnGrading.html", locals())


def courseLearnContent(request, courseid):
    courseDetail, _, _ = VF.Get_Course(courseid)
    course = models.Course.objects.get(id=courseid)
    Chapters = models.Chapter.objects.filter(sourceCourse=course)
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


def GetSection(request, courseid):
    Chapter = request.GET.get("Chapter")
    Chapter = models.Chapter.objects.get(chapterName=Chapter)
    data = []
    Sections = Chapter.sourceChapter.all()
    for Section in Sections:
        data.append(Section.sectionName)

    return JsonResponse(data, safe=False)


def GetContent(request, courseid):
    Section = request.GET.get("Section")
    Section = models.Section.objects.get(sectionName__startswith=Section)
    FilesList = models.CourseFiles.objects.filter(sourceSection=Section)
    data = {}
    for f in FilesList:
        filename = f.filename()
        data[filename] = f.courseFile.url
    # print(data)
    return JsonResponse(data, safe=False)
