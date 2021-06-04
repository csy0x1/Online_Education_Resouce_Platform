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

})