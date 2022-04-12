$(function () {
	$(".mainContainer").on("click", ".PreviewPaper", function () {
		$.ajax({
			type: "GET",
			url: "Exercise/getPaper?paperID=" + $(this).attr("name"),
			success: function (response) {
				$(".navSideBar").slideToggle(1);
				$(".mainContainer").toggleClass("WideScreen");
				$(".Exercise").html(response);
			},
		});
	});

	$(".mainContainer").on("click", ".return", function () {
		$.ajax({
			type: "GET",
			url: "Exercise?Return=true",
			success: function (response) {
				$(".navSideBar").slideToggle(1);
				$(".mainContainer").toggleClass("WideScreen");
				$(".Exercise").html(response);
			},
		});
	});
});
