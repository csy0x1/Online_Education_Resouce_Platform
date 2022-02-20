$(function(){
    $(".subCates").each(function(){
        var $this = $(this)
        var categoryID = $this.attr('id')
        $this.attr("href",$this.attr("href")+"?subcategory="+categoryID)
    })

    function GetQueryString(name)   //获取url中的参数
    {
         var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
         var r = window.location.search.substr(1).match(reg);
         if(r!=null)return  unescape(r[2]); return null;
    }
    
    function GetCategoryContent()
    {
        var subcate = GetQueryString("subcategory")
        $(".subCates,.parentCates .active").removeClass("active")
        $("#"+subcate).addClass("active")
        if(subcate==null){
            $(".parentCates").addClass("active")
        }
    }
    GetCategoryContent()

    $(".subCates,.parentCates").on("click",function(){
        window.location.href = $(this).attr("href")
        $.get($(this).attr("href"),function(data){
            console.log("1")
        })
    })

    $(".CourseCard").on("click",function(){
        var id = $(this).find(".CourseTitle").attr("id")
        window.location.href = "/course/"+id
    })

})