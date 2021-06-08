$(document).ready(function () {
    $(".user-dropdown").mouseover(function () {   //用户头像下拉菜单
        $('.dropdown-toggle').dropdown('toggle')
    })

    $('#indexCarousel').carousel({  //轮播间隔
        interval: 3000
    })

    $('#indexCarousel').hover(hoverInCarousel, hoverOutCarousel)    //轮播鼠标悬浮
    function hoverInCarousel() {
        $('.carousel-control').removeAttr('hidden')
    }
    function hoverOutCarousel() {
        $('.carousel-control').prop('hidden', 'hidden');
    }

    $('.content').hover(hoverInContent, hoverOutContent)    //课程分类鼠标悬浮变色
    function hoverInContent() {
        $(this).css({ "background-color": "rgba(0,204,153,0.1)" })
        $(this).children('.item').siblings().css({ "color": "rgb(0,204,153)" })
        $(this).children('.header').css({ "color": "rgb(0,204,153)" })
    }
    function hoverOutContent() {
        $(this).removeAttr("style")
        $(this).children(".item").siblings().removeAttr("style")
        $(this).children(".header").removeAttr("style")
    }

    $('#moreContent').hover(hoverInMore, hoverOutMore)  //打开更多课程分类
    function hoverInMore() {
        $('#moreContent').prop('hidden', 'hidden')
        $('.sub-content-area').show(100)
        $('.sub-content-area').css({ "margin-bottom": "12px" })
    }
    function hoverOutMore() {
    }

    $('.sub-content-area').hover(hoverInSub, hoverOutSub)   //关闭更多课程分类
    function hoverInSub() {
    }
    function hoverOutSub() {
        $('#moreContent').removeAttr('hidden')
            .removeAttr('style')
        $('.sub-content-area').hide()
    }

    $('.loginRegister').hover(hoverInLogin, hoverOutLogin)  //登录注册按钮鼠标悬浮
        .click(function () {
            $(location).attr('href', '/login/')
        })
    function hoverInLogin() {
        $('.loginRegister').animate({ backgroundColor: 'rgb(0,165,124)' }, 50)
    }
    function hoverOutLogin() {
        $('.loginRegister').animate({ backgroundColor: 'rgb(0,204,153)' }, 50)
    }

    $(".MPContent").click(function () { //跳转到相应课程界面
        var courseID = $(this).children(".RankCourseInfo").children(".courseID").text() //获取课程ID
        var href = '/course/' + courseID
        $(location).attr('href', href)
    })
})