$(document).ready(function () {

    $('#id_username').removeAttr("class")
    $('#id_password').removeAttr("class")
    $('#id_re_password').removeAttr("class")
    $('#id_email').removeAttr("class")
    $('#id_captcha_1').removeAttr("class")
    is_validate = false

    function username_check(username) {
        if (username == "") {
            $('#id_username').css({ "border-color": "red" })
            $('label[for=id_username]').css({ "color": "red" })
            console.log('1')
            return false
        }
        else if (username.length < 3 || username.length > 15) {
            $('#id_username').css({ "border-color": "red" })
            $('label[for=id_username]').css({ "color": "red" })
            return false

        }
        else {
            $('#id_username').removeAttr("style")
            $('label[for=id_username]').removeAttr("style")
            return true
        }
    }

    function password_check(password) {
        if (password == "") {
            $('#id_password').css({ "border-color": "red" })
            $('label[for=id_password]').css({ "color": "red" })
            console.log('2')
            return false
        }
        else if (password.length < 8 || password.length > 20) {
            $('#id_password').css({ "border-color": "red" })
            $('label[for=id_password]').css({ "color": "red" })
            return false
        }
        else {
            $('#id_password').removeAttr("style")
            $('label[for=id_password]').removeAttr("style")
            return true
        }
    }

    function re_password_check(password, re_password) {
        if (re_password == "") {
            $('#id_re_password').css({ "border-color": "red" })
            $('label[for=id_re_password]').css({ "color": "red" })
            return false
        }
        else if (re_password != password) {
            $('#id_re_password').css({ "border-color": "red" })
            $('label[for=id_re_password]').css({ "color": "red" })
            return false
        }
        else {
            $('#id_re_password').removeAttr("style")
            $('label[for=id_re_password]').removeAttr("style")
            return true
        }
    }

    function email_check(email) {
        var eFormat = /^[A-Za-z0-9+]+[A-Za-z0-9\.\_\-+]*@([A-Za-z0-9\-]+\.)+[A-Za-z0-9]+$/;

        if (email == "") {
            $('#id_email').css({ "border-color": "red" })
            $('label[for=id_email]').css({ "color": "red" })
            return false
        }
        else if (email.search(eFormat) == -1) {
            $('#id_email').css({ "border-color": "red" })
            $('label[for=id_email]').css({ "color": "red" })
            return false
        }
        else {
            $('#id_email').removeAttr("style")
            $('label[for=id_email]').removeAttr("style")
            return true
        }
    }

    $("#id_username").focus(function () { //文本框获得焦点事件
        $(this).attr('placeholder', '用户名应由 3 到 15 个字符组成')
            .blur(function () { //文本框失去焦点事件
                $(this).attr('placeholder', '')
            })
            .on("blur keyup", function () {
                var username = $('#id_username').val()
                username_check(username)
            })
    })

    $("#id_password").focus(function () { //文本框获得焦点事件
        $(this).attr('placeholder', '8 至 20 个字符，区分大小写')
            .blur(function () { //文本框失去焦点事件
                $(this).attr('placeholder', '')
            })
            .on("blur keyup", function () {
                var password = $('#id_password').val()
                password_check(password)
            })
    });

    $("#id_re_password").focus(function () { //文本框获得焦点事件
        $(this).attr('placeholder', '请再次输入密码')
            .blur(function () { //文本框失去焦点事件
                $(this).attr('placeholder', '')
            })
            .on("blur keyup", function () {
                var password = $('#id_password').val()
                var re_password = $('#id_re_password').val()

                re_password_check(password, re_password)
            })
    });

    $("#id_email").focus(function () { //文本框获得焦点事件
        $(this).attr('placeholder', '邮箱地址将有助于找回密码')
            .blur(function () { //文本框失去焦点事件
                $(this).attr('placeholder', '')
            })
            .on("blur keyup", function () {
                var email = $('#id_email').val()
                email_check(email)
            })
    });

    $("#toggle_ToS").click(function () {
        $("#modal_ToS").modal('show')
    })

    $("#modal_agree").click(function () {
        $("#modal_ToS").modal('hide')
        $("#id_agreed").prop("checked", true)
    })
    $('#modal_disagree').click(function () {
        $(location).attr("href", "/index/")
    })

    $('#sub-btn').click(function () { //前端初步数据验证
        var is_agreed = $('#id_agreed').prop("checked")
        var username = $('#id_username').val()
        var password = $('#id_password').val()
        var re_password = $('#id_re_password').val()
        var email = $('#id_email').val()

        var userchk = username_check(username)
        var pwdchk = password_check(password)
        var repwdchk = re_password_check(password, re_password)
        var emailchk = email_check(email)

        if (is_agreed) {
            if (userchk && pwdchk && repwdchk && emailchk) {
                is_validate = true
            }
            else {
                is_validate = false
            }
        }
        else {
            $("#modal_ToS").modal('show')
        }


        if (is_validate == true) {
            console.log('validated')
        }
        else {
            console.log('not validated')
        }
    });

});

