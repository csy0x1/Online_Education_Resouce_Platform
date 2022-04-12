$(function () {
	$("[name='Exercise']").attr({
		class: "active",
	});

	$(".PaperUnavilable").on("click", function () {
		toastr.options = {
			positionClass: "toast-top-center",
			progressBar: true,
			newestOnTop: true,
			showDuration: 500,
			hideDuration: 500,
			timeOut: 2000,
			extendedTimeOut: 1000,
			showEasing: "swing",
			hideEasing: "linear",
			showMethod: "fadeIn",
			hideMethod: "fadeOut",
		};
		toastr.error("未到考试时间!");
	});
});
