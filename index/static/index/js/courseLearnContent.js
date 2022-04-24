$(function () {
	$("[name='Content']").attr({
		class: "active",
	});
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

	// 根据所选章获取相应的内容
	function getSections() {
		var Chapter = $("#ChapterSelector").val();
		$.ajax({
			type: "GET",
			url: "Content/GetSection",
			dataType: "json",
			data: { Chapter: Chapter },
			success: function (response) {
				var content = "";
				$.each(response, function (i, item) {
					content += "<option value=" + item + ">" + item + "</option>";
				});
				// $('.SectionSelector').html(content)
				// Section = $('.SectionSelector').val()
				// console.log(Section)
				$("#SectionSelector").empty();
				$("#SectionSelector").html(content);
				$("#SectionSelector").selectpicker("refresh");
				$("#currentSection").text($("#SectionSelector").find("option:selected").text());
				getContent();
			},
		});
	}

	function getContent() {
		var Section = $("#SectionSelector").val();
		$.ajax({
			type: "POST",
			url: "Content/GetContent",
			dataType: "json",
			headers: { "X-CSRFToken": csrftoken },
			data: { Section: Section, Operation: "Preview" },
			success: function (response) {
				$(".fileList").html(response);
				// var content = '<tr>' +
				//     '<th>课程资源</th>' +
				//     '</tr>'
				// var tab = $(".fileTable>tbody")
				// $.each(response, function (key, value) {
				//     content += ' <tr > ' +
				//         '<td class="File">' +
				//         '<a href="' + value + '">' + key + '</a>'
				//         + '</td>' +
				//         ' </tr>'
				// })
				//tab.html(content)
				$("select").selectpicker("refresh");
			},
		});
		return false;
	}

	function GetPreview(file) {
		var Section = $("#SectionSelector").val();
		console.log(file);

		$.ajax({
			type: "POST",
			url: "Content/GetContent",
			headers: { "X-CSRFToken": csrftoken },
			dataType: "json",
			data: { Section: Section, Operation: "Preview", file: file },
			success: function (response) {
				$(".fileList").html(response);
				//videojs(document.querySelector('.video-js'))
			},
		});
	}

	$(".ChapterSelector").change(getSections);
	$(".SectionSelector").change(getContent);

	$(document).on("click", ".list-group-item", function () {
		console.log("clicked");
		var file = $(this).attr("id");
		console.log(file);
		GetPreview(file);
	});

	$(".fileList").on("click", "video", function () {
		console.log("loaded");
	});

	getSections();
});
