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
- [x] ~~**在图片上传前提供图片裁剪编辑功能，方便保证各种图片上传后的显示尺寸比例正确(如课程封面图片)**~~
    > 前端原计划是保持使用bootstrap file-input插件，在每次从文件选择器选择图片时捕获事件，将图片交由[CropperJS插件](https://github.com/fengyuanchen/cropperjs)进行裁剪，再使用返回的结果。但尝试多次以后仍然没有找到办法能够在对图片进行裁剪操作以后将其加入到file-input的上传列表中，可能与[Javascript的安全策略](https://stackoverflow.com/questions/29720794/jquery-select-input-file-and-also-set-it-to-another-input)有关，不能通过代码改变"input=file"的值，或许可以采用[DataTransfer API](https://stackoverflow.com/questions/5632629/how-to-change-a-file-inputs-filelist-programmatically)来实现，但经过多次尝试也没能成功运行。最后转向直接使用CropperJS提供的toDataURL方法将裁剪后的[图片转为BASE64编码](https://www.cnblogs.com/wangqj1996/p/10193030.html)的格式，最后与其余表单数据一起通过ajax的方式提交。
    >前端还遇到的比较大的问题就是希望实现一个用户可以随意上传、编辑图片的功能，当用户上传了一个图片后，图片会在一个模态框中被加载并可以被裁剪，进行了裁剪以后，如果感觉不满意，可以重新上传一张图片再进行裁剪操作。在实现这个功能时遇到的问题就是当用户载入了一张图片A后，如果重新载入图片B，图片C，图片D这样一次或多次载入后，整个CropperJS提供的裁剪功能会变得不正常，包括但不限于后面载入的图片裁剪状态无法保存、同时出现多个裁剪框等情况。最后通过参考插件[在github上给出的文档例子](https://github.com/fengyuanchen/cropperjs/blob/main/docs/examples/cropper-in-modal.html)，对相关的Javascript代码进行修改修复。

    > 后端要做的事则是如何将前端传过来的BASE64编码重新转换为图片并保存。需要注意的一点就是前端传过来的BASE64包含前缀"data:image/jpeg;base64,"需去除。在实现的时候遇到的问题包括在指定的目录并没有找到本应该保存的图片文件以及保存的图片文件无法打开，提示格式无法读取，由于在测试的时候比较没有头绪，对于代码的修改调整比较杂乱没有顺序，因此具体的原因不能绝对确定。但根据各种线索推测问题的原因很有可能是以下两种:  
    >    1.对于前者，可能是文件路径的编写有问题，导致文件实际被存放到了项目的根目录，而当时并没有检查根目录，因此以为是文件没有被保存。第二天在根目录下找到了本应保存的图片文件，且文件的创建时间也可以印证这一点。在通过从项目设置里引用文件保存路径以取代硬编码路径后问题得到解决。  
    >   2.对于后者，应该是BASE64的前缀没有去除，导致文件不可读。原本应该负责这部分的代码在前面的各种杂乱的测试中可能不小心被移除了，最后通过重新添加这一句代码后解决。
    