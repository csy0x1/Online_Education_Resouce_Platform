$(document).ready(function(){
    setInterval(go,800)
    var x=0;
    function go(){
        if(x<0){
            $(location).attr("href", "/index/")
        }
        else{
            x--
        }
    }
})