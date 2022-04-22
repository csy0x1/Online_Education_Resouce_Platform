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

	var PaperID;
	$(".mainContainer").on("click", ".StartExam", function () {
		$this = $(this);
		PaperID = $($this).attr("name");
		$("#StartExamWarning").modal("show");
		$("#Confirm")
			.off("click")
			.on("click", function (e) {
				//e.preventDefault();
				//$("#StartExamWarning").modal("hide");
				$.ajax({
					type: "GET",
					url: "Exercise/examination?paperID=" + PaperID,
					success: function (response) {
						$(".navSideBar").slideToggle(1);
						$(".mainContainer").toggleClass("WideScreen");
						$(".mainContainer").html(response).trigger("PaperLoaded");
						$("html, body").animate({ scrollTop: "0px" }, 0);
					},
					error: function (response) {
						console.error(response);
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
						toastr.error("操作失败");
					},
				});
			});
	});

	$(".mainContainer").on("PaperLoaded", function () {
		var EndTime = new Date($("#clock").attr("value"));
		console.log(EndTime);
		$("#clock")
			.countdown(EndTime)
			.on("update.countdown", function (event) {
				var format = "%H:%M:%S";
				if (event.offset.totalDays > 0) {
					format = "%-d day%!d " + format;
				}
				if (event.offset.weeks > 0) {
					format = "%-w week%!w " + format;
				}
				$(this).html(event.strftime(format));
			})
			.on("finish.countdown", function (event) {
				$(this).html("This offer has expired!").parent().addClass("disabled");
			});
	});

	$(".mainContainer").on("click", ".submit", function () {
		console.log("clicked");
		var AnswerSheet = {};
		var UnfinishedQuestion = 0;
		$(".QuestionArea").each(function () {
			var $this = $(this);
			var OptionName = $this.find("input:first").attr("name");
			//检查是否有未做的题目
			var SelectedOption = $("input[name='" + OptionName + "']:checked");
			if (SelectedOption.length > 0) {
				$this.find(".QuestionContent").css("color", "");
				SelectedOption.each(function (key, value) {
					var optionID = $(value).siblings(".Option").attr("id");
					AnswerSheet[optionID] = $this.attr("id");
				});
			} else {
				$this.find(".QuestionContent").css("color", "red");
				UnfinishedQuestion++;
			}
		});

		function submitPaper(e) {
			//e.preventDefault();
			//$("#StartExamWarning").modal("hide");
			$.ajax({
				type: "POST",
				url: "Exercise/examination/submitPaper",
				headers: { "X-CSRFToken": csrftoken },
				dataType: "json",
				data: {
					PaperID: PaperID,
					AnswerSheet: JSON.stringify(AnswerSheet),
				},
				success: function (response) {
					$.ajax({
						type: "GET",
						url: "Exercise?Return=true",
						success: function (response) {
							$(".navSideBar").slideToggle(1);
							$(".mainContainer").toggleClass("WideScreen");
							$(".mainContainer").html(response);
						},
					});
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
					toastr.success("提交成功");
				},
			});
		}

		if (UnfinishedQuestion > 0) {
			console.log(PaperID);
			$(".ModalContent").text("您还有" + UnfinishedQuestion + "道题目未完成，是否继续提交？");
			$("#SubmitWarning").modal("show");
			$("#Confirm").off("click").on("click", submitPaper);
		} else {
			console.log(UnfinishedQuestion);
			submitPaper();
		}
	});
});
