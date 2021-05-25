/*
登录登出信息界面
功能: 延时显示信息，超时后返回主页
*/

$(document).ready(function () {
    setInterval(go, 800)
    var x = 0;
    function go() {
        if (x < 0) {
            $(location).attr("href", "/index/")
        }
        else {
            x--
        }
    }
})