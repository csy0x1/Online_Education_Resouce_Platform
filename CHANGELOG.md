# ver 20220220
> - [课程分类界面] 新增课程分类界面，在界面内显示各分类下属课程
> - [课程分类] 为主界面的课程分类菜单添加跳转链接，以跳转到相应的课程分类界面 

# ver 20220209
> - [CSS样式表] 调整课程信息界面以及主页的课程图片的css，防止因图片尺寸过大、过长导致网页样式变形

# ver 20220208
> - [杂项] 更新Markdown文档格式
> - [课程基础设置] 恢复读取课程原信息预填入编辑器的功能
> - [课程基础设置] 重写课程基础设置部分代码，手动设置表单的input以取代django的表单生成，重写后端信息保存代码；现在将根据前端传入的不同操作类型执行不同的操作(课程图片上传和其他基本信息修改分开)

# ver 20220206/2
> - [课程文件上传] 修改文件列表html，以适配ajax刷新文件列表
> - [课程文件上传] 增加文件删除功能，删除后自动刷新列表
  
# ver 20220206
> - [课程文件上传] 现在上传后会延迟1.5秒后获取最新的课程文件列表
> - [课程文件上传] 为文件列表项目添加复选框，以及删除按钮
> - [课程文件上传] 添加操作标识符，以便区分请求是上传文件还是其他操作

# ver 20220205
> - [课程基础设置] 将课程设置中的多个TextArea修改为Markdown编辑器，以支持Markdown格式
> - [课程基础设置] 现在课程大纲修改节点后将会自动根据索引进行排序，并赋予新的索引值(若发生改变)
> - [课程基础设置] 课程大纲编辑节点名称时编辑框将自动隐去索引
> - [课程基础设置] 新增节点时若不填写标题名称而失去焦点时，节点将不再会被添加
> - [课程基础设置] 为课程大纲编辑器添加使用说明