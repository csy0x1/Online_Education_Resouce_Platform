$(document).ready(function () {
    $('.courseBtn').hover(hoverInLogin, hoverOutLogin)
        .click(function () {
            $(location).attr('href', '#')
        })
    function hoverInLogin() {
        $('.courseBtn').animate({ backgroundColor: 'rgb(0,165,124)' }, 50)
    }
    function hoverOutLogin() {
        $('.courseBtn').animate({ backgroundColor: 'rgb(0,204,153)' }, 50)
    }
});