from index.models import (
    Chapter,
    Course,
    CourseFiles,
    CourseNotice,
    Section,
    Users,
    CourseCategory,
)
from django.contrib import admin

# Register your models here.


class CourseCategoryAdmini(admin.ModelAdmin):
    list_display = ("CategoryID", "CategoryName", "Is_Root", "DisplayOrder", "ParentID")
    ordering = ("-ParentID", "DisplayOrder", "-Is_Root")
    list_editable = ("DisplayOrder",)
    list_filter = ("Is_Root",)


class CourseAdmin(admin.ModelAdmin):
    list_display = ("id", "Course_Name", "Stu_Count")
    readonly_fields = ("Starting_Time", "id")


class UserAdmin(admin.ModelAdmin):
    readonly_fields = ("id", "create_time")
    filter_horizontal = ("selected_courses",)


class NoticeAdmin(admin.ModelAdmin):
    list_display = ("id", "Title", "sourceCourse")
    list_filter = ("sourceCourse",)


class FilesAdmin(admin.ModelAdmin):
    list_display = ("id","fileName","courseFile", "sourceSection")


admin.site.register(Users, UserAdmin)
admin.site.register(Course, CourseAdmin)
admin.site.register(CourseCategory, CourseCategoryAdmini)
admin.site.register(CourseNotice, NoticeAdmin)
admin.site.register(Chapter)
admin.site.register(Section)
admin.site.register(CourseFiles, FilesAdmin)
