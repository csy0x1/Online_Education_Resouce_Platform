from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.urls import path
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
        "course/<int:courseid>/Setting/Announcement",
        views.courseSettingAnno,
        name="announcementSetting",
    ),
    path(
        "course/<int:courseid>/Setting/Announcement/Post",
        views.postAnnouncement,
        name="announcementPost",
    ),
    path(
        "course/<int:courseid>/Setting/Announcement/Delete",
        views.deleteAnnouncement,
        name="announcementDelete",
    ),
    path(
        "course/<int:courseid>/Modify",
        views.modifyStudents,
        name="modifyStudents",
    ),
    # 课程学习相关url
    path(
        "course/<int:courseid>/learn/Announcement",
        views.courseLearnAnno,
        name="Announcement",
    ),
    path("course/<int:courseid>/learn", views.courseLearn, name="Learn"),
    # path('course/<int:courseid>/Setting/<str:section>',views.courseSetting, name='courseSetting'),
    path("course/<int:courseid>/", views.courseInfo, name="courseInfo"),
    # path('test/test',views.index) http://*link*/test/test 也可访问index
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
