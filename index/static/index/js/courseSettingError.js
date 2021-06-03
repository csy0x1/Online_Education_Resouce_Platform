$(document).ready(function () {
    setInterval(go, 800)
    var x = 0;
    function go() {
        if (x < 0) {
            window.history.go(-1);
        }
        else {
            x--
        }
    }

    $('.link').click(function () {
        x = -1
        go()
    });
})
