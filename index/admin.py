from index.models import Course, Users,CourseCategory
from django.contrib import admin

# Register your models here.

class CourseCategoryAdmini(admin.ModelAdmin):
    list_display=('CategoryName','Is_Root','DisplayOrder','ParentID','CategoryID')
    ordering=('-ParentID','DisplayOrder','-Is_Root')
    list_editable=('DisplayOrder',)
    list_filter=('Is_Root',)
    
class CourseAdmin(admin.ModelAdmin):
    list_display=('Course_Name','id')
    readonly_fields = ('Starting_Time','id')

class UserAdmin(admin.ModelAdmin):
    readonly_fields = ('create_time',)

admin.site.register(Users,UserAdmin)
admin.site.register(Course,CourseAdmin)
admin.site.register(CourseCategory,CourseCategoryAdmini)