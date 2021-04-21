from index.models import Course, Users,CourseCategory
from django.contrib import admin

# Register your models here.

class CourseCategoryAdmini(admin.ModelAdmin):
    list_display=('CategoryName','Is_Root','DisplayOrder','ParentID')
    ordering=('-ParentID','DisplayOrder','-Is_Root')
    list_editable=('DisplayOrder',)
    list_filter=('Is_Root',)
    

admin.site.register(Users)
admin.site.register(Course)
admin.site.register(CourseCategory,CourseCategoryAdmini)