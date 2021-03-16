$(document).ready(function(){

    $("#id_username").focus(function(){ //文本框获得焦点事件
            $(this).attr('placeholder','用户名应由 3 到 15 个字符组成')
        .blur(function(){ //文本框失去焦点事件
            $(this).attr('placeholder','')
        });
    });
    
    $("#id_password").focus(function(){ //文本框获得焦点事件
            $(this).attr('placeholder','8 至 20 个字符，区分大小写')
        .blur(function(){ //文本框失去焦点事件
            $(this).attr('placeholder','')
        });
    });

    $("#id_email").focus(function(){ //文本框获得焦点事件
            $(this).attr('placeholder','邮箱地址将有助于找回密码')
        .blur(function(){ //文本框失去焦点事件
            $(this).attr('placeholder','')
        });
    });

    $('#sub-btn').click(function(){
        var username = $('#id_username').val()
        var password = $('#id_password').val()
        var re_password = $('#id_re_password').val()
        var email = $('#id_email').val()
        var gender = $('#id_gender').val()
        var is_agreed = $('#id_agreed').val()

        if(username="123"){
            $('#id_username').css({"border-color":"red"})
            $('#lab_name').css({"color":"red"})
        }
    });

});



