$(document).ready(function () {

    var simpleMDE = []
    $(".MarkdownEditor").each(function(i=0){
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
            locale: moment.locale('zh-tw'),
            minDate: today
        });
        $('#id_Ending_Time').datetimepicker({
            format: 'YYYY-MM-DD HH:mm',
            locale: moment.locale('zh-tw'),
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

    $("#tree").fancytree({  //章节编辑TreeView        
        extensions: ["edit"],
        edit: {
            triggerStart: ["mac+enter", "shift+click"],
            beforeEdit: function (event, data) {
                // Return false to prevent edit mode
            },
            edit: function (event, data) {
                // Editor was opened (available as data.input)
            },
            beforeClose: function (event, data) {
                // Return false to prevent cancel/save (data.input is available)
                console.log(event.type, event, data);
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
                if (data.save) {
                    data.node.setTitle(data.node.getIndexHier() + " " + data.node.title);

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
            $.ui.fancytree.getTree("#tree").getRootNode().sortChildren(null, true);
        }
        if (e.shiftKey && e.keyCode == 113) {
            var node = $.ui.fancytree.getTree("#tree").getActiveNode();
            node.editCreateNode("after", {
                title: "Node title",
                folder: true
            });
            $.ui.fancytree.getTree("#tree").getRootNode().sortChildren(null, true);
        }
        if( e.shiftKey && e.keyCode ==46){
            var node = $.ui.fancytree.getTree("#tree").getActiveNode();
            node.remove()
            $.ui.fancytree.getTree("#tree").getRootNode().sortChildren(null, true);
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

    $("#updateImg").fileinput({     //文件上传
        'language': 'zh',
        allowedFileExtensions: ['jpg', 'png', 'gif'],//接收的文件后缀
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

});