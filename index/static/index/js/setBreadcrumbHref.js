$(function(){
    var categoryID = $(".Category").attr("id")
    $(".Category").attr("href",$(".Category").attr("href")+"?subcategory="+categoryID)
})