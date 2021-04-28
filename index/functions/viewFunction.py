import datetime

from .. import models
from rest_framework import serializers
from datetime import datetime


def Get_Category(): #获取分类信息
    root = models.CourseCategory.objects.filter(Is_Root=True).order_by('DisplayOrder')
    rootlist=[]
    dict={}
    for i in range(root.count()):
        Child = models.CourseCategory.objects.filter(ParentID=root[i].CategoryID).order_by('DisplayOrder')
        ChildCategory = []
        for j in range(Child.count()):
            ChildCategory.append(str(Child[j]))
        rootlist.append(str(root[i]))
        dict[str(root[i])]=ChildCategory
    return rootlist,dict

def Get_Website_Info(): #获取网站统计数据
    userCount = models.Users.objects.all().count()
    newestUser = models.Users.objects.latest('create_time')
    courseCount = models.Course.objects.all().count()
    return locals() #locals()以字典形式返回所有局部变量

def Get_Course(courseid):   #获取课程信息
    object = models.Course.objects.get(pk=courseid)
    #格式化器
    class CourseDetailSerializer(serializers.ModelSerializer):    #https://stackoverflow.com/questions/21925671/convert-django-model-object-to-dict-with-all-of-the-fields-intact
        class Meta:
            model = models.Course
            fields = '__all__'
    class CourseInfoSerializer(serializers.ModelSerializer):
        class Meta:
            model = models.Course
            fields = ['Course_Info','Course_Goal','Course_Chapter','Grade_Requirements','Reference','QA']

    courseDetail = CourseDetailSerializer(object).data
    try:
        courseDetail['Course_Category'] = models.CourseCategory.objects.get(pk=courseDetail['Course_Category']) #格式化器只获取了外键的ID，要通过ID再获取外键的数值
    except:
        pass
    courseInfo = CourseInfoSerializer(object).data
    courseInfo['课程说明'] = courseInfo.pop('Course_Info')
    courseInfo['课程目标'] = courseInfo.pop('Course_Goal')
    courseInfo['课程大纲'] = courseInfo.pop('Course_Chapter')
    courseInfo['成绩要求'] = courseInfo.pop('Grade_Requirements')
    courseInfo['参考资料'] = courseInfo.pop('Reference')
    courseInfo['常见问题'] = courseInfo.pop('QA')
    #将时间格式从TZ格式(2021-04-26T22:55:09.695785+08:00)转换成datetime对象再转换成字符串格式输出
    #https://stackoverflow.com/questions/13182075/how-to-convert-a-timezone-aware-string-to-datetime-in-python-without-dateutil
    courseDetail['Starting_Time'] = datetime.fromisoformat(courseDetail['Starting_Time']).strftime('%Y年%m月%d日')
    courseDetail['Ending_Time'] = datetime.fromisoformat(courseDetail['Ending_Time']).strftime('%Y年%m月%d日')
    return courseDetail,courseInfo

# def test(Chapter):
#     course = models.Course.objects.create(Course_Name='1',Course_Teacher='1',Course_Info='1',Stu_Count=1,Course_Chapter=Chapter,View_Count=1,Ending_Time=datetime.datetime.now())