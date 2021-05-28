$(document).ready(function () {

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


    $('.LoginBtn').hover(hoverInLogin, hoverOutLogin)
        .click(function () {
            $(location).attr('href', '/login')
        })

    function hoverInLogin() {
        $('.LoginBtn').animate({ backgroundColor: 'rgb(0,165,124)' }, 50)
    }
    function hoverOutLogin() {
        $('.LoginBtn').animate({ backgroundColor: 'rgb(0,204,153)' }, 50)
    }

    $('.courseBtn-SignUp').hover(hoverInJoin, hoverOutJoin)
        /*
        此处打算实现报名功能，不一定要通过Jquery和Ajax提交用户数据，可以发送一个报名的信号，然后在后端
        进行处理(获取报名的用户名，将该名学生加入到课程名单中 etc.
        */
        .click(function () {
            $.ajax({
                type: "POST",
                url: 'SignUp',
                headers: { 'X-CSRFToken': csrftoken },
                data: {
                    isSignUp: true,
                },
                success: function (response) {
                    window.parent.location.reload();
                }
            });
        })
    function hoverInJoin() {
        $('.courseBtn-SignUp').animate({ backgroundColor: 'rgb(0,165,124)' }, 50)
    }
    function hoverOutJoin() {
        $('.courseBtn-SignUp').animate({ backgroundColor: 'rgb(0,204,153)' }, 50)
    }

    $('.courseBtn-Resign').hover(hoverInExit, hoverOutExit)
        .click(function () {
            $('#resignConfirm').modal({
                keyboard: true,
            })
            $('.confirm').click(function () {
                $.ajax({
                    type: "POST",
                    url: 'Resign',
                    headers: { 'X-CSRFToken': csrftoken },
                    data: {
                        isResign: true,
                    },
                    success: function (response) {
                        $('#resignConfirm').modal('hide')
                        window.parent.location.reload();
                    }
                });
            })
        })
    function hoverInExit() {
        $('.courseBtn-Resign').animate({ backgroundColor: 'rgb(216,140,0)' }, 50)
    }
    function hoverOutExit() {
        $('.courseBtn-Resign').animate({ backgroundColor: 'rgb(255,165,0)' }, 50)
    }

    $('.courseBtn-Setting').hover(hoverInSetting, hoverOutSetting)
        .click(function () {
            $(location).attr('href', 'Setting')
        })

    function hoverInSetting() {
        $('.courseBtn-Setting').animate({ backgroundColor: 'rgb(0,162,216)' }, 50)
    }
    function hoverOutSetting() {
        $('.courseBtn-Setting').animate({ backgroundColor: 'rgb(0,191,255)' }, 50)
    }
});