$(function () {

    $("[role='studentManagement']").attr({
        "class": "active",
    })

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

    $(".removeStudent").click(function () {
        var List = []
        $(".studentCkBox").each(function () {
            if ($(this).prop("checked")) {
                var value = $(this).parent().siblings(".student-Name").text().trim()
                //input是表格行td的子元素，而学生姓名是另一表格行td，要通过已选框查找到对应学生姓名
                //应先找到input的父元素td，然后查找父元素的同胞元素td(.student-Name)
                List.push(value)
            }
        })
        $("#removeConfirm").modal({
            keyboard: true,
        })
        $(".confirm").click(function () {
            $.ajax({
                type: "POST",
                url: "Students/Remove",
                headers: { 'X-CSRFToken': csrftoken },
                data: {
                    studentsList: List,
                },
                traditional: true,
                success: function (response) {
                    $("#removeConfirm").modal('hide')
                    window.parent.location.reload()
                }

            })
        })
    })

    $(".selectAll").click(function () {
        $(".studentCkBox").prop("checked", $(this).prop("checked"))
    })
})