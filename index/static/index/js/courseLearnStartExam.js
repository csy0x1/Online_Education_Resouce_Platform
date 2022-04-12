$(function () {
	$(".mainContainer").on("click", ".StartExam", function () {
		$this = $(this);
		$("#StartExamWarning").modal();
		$("#Confirm")
			.off("click")
			.on("click", function (e) {
				toastr.success("clicked");
			});
	});
});
