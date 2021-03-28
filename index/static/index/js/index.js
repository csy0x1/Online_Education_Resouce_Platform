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
})