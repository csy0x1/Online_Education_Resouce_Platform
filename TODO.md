- [x] **~~在课程设置界面 当鼠标移至右上角头像下拉菜单时，其他下拉菜单也会被触发~~**
    > solved，重写右上角头像下拉菜单部分
- [x] **~~首页登录/注册按钮无法使用，点击无反应~~**
     > solved, bootstrap 的 js cdn 过期了
- [ ] **//TODO 登录时不应准确显示是用户名还是密码错误，以防恶意用户依次判断一个用户是否存在**
- [x] **~~课程文件上传功能难以实现~~**  
    >   solved, 不使用 django 提供的自动表单生成，手动在 html 内设置表单
      参考文献 https://blog.csdn.net/t8116189520/article/details/82015431
      https://blog.51cto.com/mbb97/2363772

- [x] **~~Markdown 相关~~**：
    >  编辑器：SimpleMDE
      渲染：https://github.com/agusmakmun/django-markdown-editor

- [x] **~~课程公告部分提交表单发布公告会多出一个 GET 请求，且 url 会自动挂上参数()~~**
    >  https://blog.csdn.net/yu980219/article/details/114813267
       1. Form 表单不添加 method 的条件下，默认提交方式为 “get”，
       2. 如果不给 button 添加 type=“button”，点击 button 时会触发表单的 submit 事件，导致页面刷新，url 请求会再次发送；(问题所在，提交按钮没有添加 type)b

- [x] **~~Markdown 编辑器设置最高高度，以及限定最高高度的情况下最后一行会被编辑器切断，显示不完整~~**  
    >   solved
      https://github.com/sparksuite/simplemde-markdown-editor/issues/619
      https://github.com/sparksuite/simplemde-markdown-editor/issues/205

- [x] **~~Settimeout 没有延迟~~**  
    >   solved ，setTimeout 的第一个参数必须是需要编译的代码或者是一个函数方法
      https://blog.csdn.net/u014805893/article/details/77072832

- [x] **~~课程文件复选框如何设置全选/单选，以及根据是否有复选框选中的状态来控制删除按钮的状态~~**  
    >   solved
      https://blog.csdn.net/aiolos1111/article/details/52047380
      https://stackoverflow.com/questions/203198/event-binding-on-dynamically-created-elements

- [x] **~~删除课程文件后动态刷新表格~~**
    >  solved, 用 thead 标签定义表头，tbody 标签定义表格内容
      https://www.runoob.com/html/html-tables.html

- [x] **~~课程图片的大小会对课程信息界面的页面排版有影响~~**
    > 暂时修复，待后期CSS重新排版测试
- [x] ~~**课程分类选择应区分根分类和子分类**~~
- [ ] **课程学习中的公告未被渲染成Markdown格式**
- [ ] **课程学习中课件未显示文件列表**
- [x] ~~**每个分类都有自己的分类ID，子分类通过外键连接到父分类，在此情况下需要实现查询某个父分类下的所有课程(如查询计算机分类下的课程，即需要显示包括C++/Python/JAVA等子分类下的所有课程)**~~
    > 可以通过Q对象实现或的逻辑，传入一个分类ID，获取所有ID为这个ID或者父分类ID为此ID的查询集(QuerySet，这个查询集包含该分类及其所有子分类)。再通过这个查询集在课程的数据表中进行查询，返回结果
    [查询集查询交集](https://stackoverflow.com/questions/10473149/django-filter-on-queryset-intersection)
    [Q对象](https://www.liujiangblog.com/course/django/129)
- [x] ~~**一段Javascript代码被执行了两次**~~
    > Javascript脚本在页面加载时被载入了两次
- [x] ~~**通过URL向后端传入当前浏览的分类的ID，通过参数来传子分类ID(category/<父分类ID>?subcategory=<子分类ID>)**~~
    > [通过JS获取地址栏参数](https://www.cnblogs.com/jinshuo/p/8074052.html)
- [ ] **在图片上传前提供图片裁剪编辑功能，方便保证各种图片上传后的显示尺寸比例正确(如课程封面图片)**
    