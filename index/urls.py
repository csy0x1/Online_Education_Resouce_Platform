from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.urls import include, path
from django.urls.conf import re_path

from . import views

app_name = "index"

urlpatterns = [
    path("", views.index, name="index"),
    path("index/", views.index),
    path("course/<int:courseid>/SignUp", views.SignUp),
    path("course/<int:courseid>/Resign", views.Resign),
    path("course/<int:courseid>/saveNode", views.saveNode),
    path("course/<int:courseid>/getNode", views.getNode),
    path("course/<int:courseid>/Setting", views.courseSetting, name="courseSetting"),
    path(
        "course/<int:courseid>/Setting/Students",
        views.courseSettingStudent,
        name="studentSetting",
    ),
    path(
        "course/<int:courseid>/Setting/Students/Remove",
        views.removeStudents,
        name="removeStudents",
    ),
    path(
        "course/<int:courseid>/Setting/Notice",
        views.courseSettingNotice,
        name="noticeSetting",
    ),
    path(
        "course/<int:courseid>/Setting/Chapter",
        views.courseSettingChapter,
        name="chapterSetting",
    ),
    path(
        "course/<int:courseid>/Setting/Chapter/GetSection",
        views.GetSection,
        name="GetSection",
    ),
    path(
        "course/<int:courseid>/Setting/Chapter/GetContent",
        views.GetContent,
        name="GetContent",
    ),
    path(
        "course/<int:courseid>/Setting/Notice/Post",
        views.postNotice,
        name="noticePost",
    ),
    path(
        "course/<int:courseid>/Setting/Notice/Delete",
        views.deleteNotice,
        name="noticeDelete",
    ),
    path("course/<int:courseid>/Setting/QuestionBank",views.courseSettingQuestionBank,name="questionBank"),

    # 课程学习相关url
    path(
        "course/<int:courseid>/learn/Notice",
        views.courseLearnNotice,
        name="Notice",
    ),
    path(
        "course/<int:courseid>/learn/Grading", views.courseLearnGrading, name="Grading"
    ),
    path(
        "course/<int:courseid>/learn/Content", views.courseLearnContent, name="Content"
    ),
    path(
        "course/<int:courseid>/learn/Content/GetSection",
        views.GetSection,
        name="GetSection",
    ),
    path(
        "course/<int:courseid>/learn/Content/GetContent",
        views.GetContent,
        name="GetContent",
    ),
    path("course/<int:courseid>/learn", views.courseLearn, name="Learn"),
    # path('course/<int:courseid>/Setting/<str:section>',views.courseSetting, name='courseSetting'),
    path("course/<int:courseid>/", views.courseInfo, name="courseInfo"),
    # path('test/test',views.index) http://*link*/test/test 也可访问index

    path("category/<int:categoryID>", views.categoryPage, name="category"),

    path('martor/', include('martor.urls')),    #Markdown
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
