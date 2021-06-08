$(function () {
    $("[role='annoucementManage']").attr({
        "class": "active",
    })

    function titleCount() {     //标题字数统计
        $('#titleaddon').text($('input[name="Title"]').val().length + '/20');
    };
    $('input[name="Title"]').bind('change blur keyup input', titleCount);

    titleCount();

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

    $(".remove").click(function () {
        var List = []
        $(".panel-heading").find("input[type='checkbox']").each(function () {
            if ($(this).prop("checked")) {
                var id = $(this).parent().parent().siblings(".panel-collapse").find(".id").text()
                List.push(id)
            }
        })
        $("#removeConfirm").modal({
            keyboard: true,
        })
        $(".confirm").click(function () {
            $.ajax({
                type: "POST",
                url: "Notice/Delete",
                headers: { 'X-CSRFToken': csrftoken },
                data: { announcementList: List, },
                traditional: true,
                success: function (response) {
                    $("#removeConfirm").modal("hide")
                    window.parent.location.reload()
                }
            })
        })
    })

    $(".selectAll").click(function () {
        $(".panel-heading").find("input[type='checkbox']").prop("checked", $(this).prop("checked"))
        //全选按钮，令所有公告的复选框状态与全选复选框状态保持一致
    })
})