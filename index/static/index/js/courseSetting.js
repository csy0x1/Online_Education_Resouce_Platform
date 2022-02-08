$(document).ready(function () {

    var simpleMDE = []
    $("TextArea").each(function(i=0){
        simpleMDE[i] = new SimpleMDE({element:this})
    })

    $("[role='basicInfo']").attr({
        "class": "active",
    })

    $("#CourseCategory").attr({ //初始化下拉选择框
        "class": "selectpicker",
        "data-live-search": "true",
        "data-width": "85%"
    })

    $(function () { //初始化日期选择器
        var today = new Date()
        $('#datetimepicker1').datetimepicker({
            format: 'YYYY-MM-DD HH:mm',
            locale: moment.locale('zh-cn'),
            minDate: today
        });
    });

    function getCookie(name) {      //获取CSRF令牌
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    var orgtitle
    $("#tree").fancytree({  //章节编辑TreeView    
        extensions: ["edit"],
        edit: {
            triggerStart: ["mac+enter", "shift+click"],
            beforeEdit: function (event, data) {
                // Return false to prevent edit mode
            },
            edit: function (event, data) {
                data.input.val(data.orgTitle.split(/ (.+)/)[1]) //标题去除索引数字再进行编辑
                // Editor was opened (available as data.input)
            },
            beforeClose: function (event, data) {
                // Return false to prevent cancel/save (data.input is available)
                // console.log(event.type, event, data);
                orgtitle = data.input.val() //获取修改后的标题(不包含索引)
                if (data.originalEvent.type === "mousedown") {
                    // We could prevent the mouse click from generating a blur event
                    // (which would then again close the editor) and return `false` to keep
                    // the editor open:
                    //                  data.originalEvent.preventDefault();
                    //                  return false;
                    // Or go on with closing the editor, but discard any changes:
                    //                  data.save = false;
                }
            },
            save: function (event, data) {
                // Save data.input.val() or return false to keep editor open
                // console.log("save...", this, data);
                // // Simulate to start a slow ajax request...
                // setTimeout(function () {
                //     $(data.node.span).removeClass("pending");
                //     // Let's pretend the server returned a slightly modified
                //     // title:
                //     data.node.setTitle(data.node.getIndexHier() + " " + data.node.title + "!");
                // }, 100);
                // We return true, so ext-edit will set the current user input
                // as title
                $(data.node.span).removeClass("pending");
                // $.ajax({
                //     type: "POST",
                //     url: "saveNode",
                //     headers: { 'X-CSRFToken': csrftoken },
                //     data: {
                //         key: data.node.key,
                //         title: data.input.val(),
                //         Index: data.node.getIndexHier()
                //     },
                //     success: function (response) {
                //     }
                // })
                return true;
            },
            close: function (event, data) {
                // Editor was removed
                data.node.setTitle(data.node.getIndexHier() + " " + orgtitle)   //将当前的节点标题添加上索引号
                if (data.save) {
                    var children = $.ui.fancytree.getTree("#tree").getRootNode().children;
                    console.log(children)
                    children.forEach(function (value,Index){
                        value.setTitle(value.title.split(/ (.+)/)[1])
                        value.setTitle(value.getIndexHier() + " " + value.title);
                        if(value.children!=null){
                            value.children.forEach(function(cValue,cIndex){
                                cValue.setTitle(cValue.title.split(/ (.+)/)[1])
                                cValue.setTitle(cValue.getIndexHier() + " " + cValue.title);
                            })
                        }
                    })
                    // 以上几行实现修改节点后调整节点显示的索引
                    $.ui.fancytree.getTree("#tree").getRootNode().sortChildren(function(a,b){
                        var x = parseFloat(a.getIndexHier()),
                        y = parseFloat(b.getIndexHier());
                    // eslint-disable-next-line no-nested-ternary
                        return x === y ? 0 : x > y ? 1 : -1;
                        }, true);  
                    // 完成编辑后对树以索引进行排序

                    // Since we started an async request, mark the node as preliminary
                    $(data.node.span).addClass("pending");
                }
            },

        },
        source: { url: "getNode" },
    });

    $("#tree").keydown(function (e) {   //快捷键
        if (e.shiftKey && e.keyCode == 112) {
            var node = $.ui.fancytree.getTree("#tree").getActiveNode();
            if (node.getLevel() < 2) {
                node.editCreateNode("child", "");
            }
        }
        if (e.shiftKey && e.keyCode == 113) {
            var node = $.ui.fancytree.getTree("#tree").getActiveNode();
            node.editCreateNode("after", "");      
        }
        if( e.shiftKey && e.keyCode ==46){
            var node = $.ui.fancytree.getTree("#tree").getActiveNode();
            node.remove()   
        }
        if (e.keyCode == 13) {
            var tree = $.ui.fancytree.getTree("#tree")
            var dic = tree.toDict(true)
            var leafNodes = [];
            var parent = [];
            var dict = {}

            tree.visit(function (node) {
                if (node.parent && node.parent.title != "root") {
                    parent.push(node.parent.title)
                }
            });
            parent = unique(parent)
            console.log(dic)
            // console.log(parent)
            // console.log(leafNodes)
            $.ajax({
                type: "POST",
                url: "saveNode",
                headers: { 'X-CSRFToken': csrftoken },
                data: {
                    dict: JSON.stringify(dic)
                },
                success: function (response) {
                }
            })
        }
    });

    $("#input-CourseImage").fileinput({     //文件上传
        'language': 'zh',
        allowFileType:['image'],
        uploadUrl:'Setting',
        uploadExtraData:function(){
            return{
                "operationType": "uploadImage",
            }
        },
        ajaxSettings: {
            'headers':{"X-CSRFToken": csrftoken}
        }
    });

    function unique(arr) {
        var result = [], hash = {};
        for (var i = 0, elem; (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;
    }

    $("#submitForms").on("click", function () {
        var MDEdata = []
        MDEdata.push($("#CourseIdInput").val())
        $.each(simpleMDE,function(i=0){
            MDEdata.push(simpleMDE[i].value())
        })
        MDEdata.push($("#CourseCategory").val())
        MDEdata.push($("#Ending_Time").val())
        $.ajax({
            type: "POST",
            url: "Setting",
            headers: { 'X-CSRFToken': csrftoken },
            data: {
                operationType: "submitForm",
                form: MDEdata,
            },
            success: function (response) {
                window.setTimeout(window.location.reload(),1500)
            }
        })
    })

});