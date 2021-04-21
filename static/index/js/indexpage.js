$(document).ready(function () {
    $(".user-avatar").mouseover(function () {
        $('.dropdown-toggle').dropdown('toggle')
    })

    $('#indexCarousel').carousel({
        interval: 3000
    })

    $('#indexCarousel').hover(hoverInCarousel, hoverOutCarousel)
    function hoverInCarousel() {
        $('.carousel-control').removeAttr('hidden')
    }
    function hoverOutCarousel() {
        $('.carousel-control').prop('hidden', 'hidden');
    }
    $('.content').hover(hoverInContent, hoverOutContent)
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

    $('#moreContent').hover(hoverInMore, hoverOutMore)
    function hoverInMore() {
        $('#moreContent').prop('hidden', 'hidden')
        $('.sub-content-area').show(100)
        $('.sub-content-area').css({ "margin-bottom": "12px" })
    }
    function hoverOutMore() {
    }

    $('.sub-content-area').hover(hoverInSub, hoverOutSub)
    function hoverInSub() {
    }
    function hoverOutSub() {
        $('#moreContent').removeAttr('hidden')
            .removeAttr('style')
        $('.sub-content-area').hide()
    }
})