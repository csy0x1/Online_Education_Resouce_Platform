$(function () {
	function getCookie(name) {
		//获取CSRF令牌
		let cookieValue = null;
		if (document.cookie && document.cookie !== "") {
			const cookies = document.cookie.split(";");
			for (let i = 0; i < cookies.length; i++) {
				const cookie = cookies[i].trim();
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) === name + "=") {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
	const csrftoken = getCookie("csrftoken");

	$("[role='PaperManagement']").attr({
		class: "active",
	});

	$(".CreatePaper").on("click", function () {
		$.ajax({
			type: "GET",
			url: "PaperManagement/createPaper",
			success: function (response) {
				$(".navSideBar").slideToggle(1);
				$(".CreatePaper").slideToggle(1);
				$(".Return").slideToggle(1);
				$(".mainContainer").toggleClass("WideScreen");
				$(".paperOverview").html(response).trigger("creatorLoaded");
			},
		});
		return false;
	});

	$(".mainContainer").on("click", ".PreviewPaper", function () {
		$.ajax({
			type: "GET",
			url: "PaperManagement/getPaper?paperID=" + $(this).attr("name"),
			success: function (response) {
				$(".navSideBar").slideToggle(1);
				$(".CreatePaper").slideToggle(1);
				$(".mainContainer").toggleClass("WideScreen");
				$(".paperOverview").html(response);
			},
		});
	});

	$(".mainContainer").on("click", ".DeletePaper", function () {
		$this = $(this);
		$("#DeleteWarning").modal();
		$("#Confirm")
			.off("click")
			.on("click", function (e) {
				e.preventDefault();
				$.ajax({
					type: "GET",
					url: "PaperManagement/deletePaper?paperID=" + $($this).attr("name"),
					success: function (response) {
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
						toastr.options.onHidden = function () {
							$(".paperOverview").html(response);
						};
						toastr.success("删除成功");
					},
					error: function (response) {
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
						toastr.error("发生错误，操作未完成");
					},
				}).done(function () {
					$("#DeleteWarning").modal("hide");
				});
			});
	});

	$(".mainContainer").on("click", ".return", function () {
		$.ajax({
			type: "GET",
			url: "PaperManagement?Return=true",
			success: function (response) {
				$(".navSideBar").slideToggle(1);
				$(".CreatePaper").slideToggle(1);
				$(".mainContainer").toggleClass("WideScreen");
				$(".paperOverview").html(response);
			},
		});
	});
});
