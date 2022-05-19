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

	//初始化表格
	var previewTable, SelectedTable, PaperInfoTable;
	$(".mainContainer").on("creatorLoaded", function () {
		PaperInfoTable = $("#PaperInfoTable").DataTable({
			dom: '<"TableTop"f>rt<"TableBottom"lip><"clear">',
			language: {
				url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Chinese.json",
			},
		});

		previewTable = $("#QuestionOverviewTable").DataTable({
			//题库表初始化
			dom: '<"TableTop"f>rt<"TableBottom"lip><"clear">',
			processing: true,
			order: [[2, "asc"]],
			language: {
				url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Chinese.json",
			},
			ajax: "QuestionBank/getQuestionBank",
			columns: [
				{
					className: "selector",
					orderable: false,
					defaultContent: '<input type="checkbox" name="selector">',
					title: '<input type="checkbox" name="selectAll">',
				},
				{
					className: "dt-control",
					orderable: false,
					defaultContent: "",
					title: "",
				}, //展开收起按钮
				{ title: "题目内容", className: "QName", data: "QuestionName" }, //题目内容
				{ title: "题目类型", className: "QType", data: "QuestionType" }, //题目类型
				{ title: "题目分值", className: "QScore", data: "QuestionScore" }, //题目分值
				{ title: "是否公开", className: "QPublic", data: "PublicRelease" }, //是否公开
				{ title: "引用次数", className: "QReference", data: "ReferenceCount" }, //引用次数
				{
					title: "选择",
					orderable: false,
					defaultContent: '<span class="glyphicon glyphicon-plus select"></span>',
					className: "QSelect",
				}, //删除
			],
		});

		SelectedTable = $("#SelectedQuestionTable").DataTable({
			//已选题目表初始化
			dom: '<"TableTop"f>rt<"TableBottom"lip><"clear">',
			autoWidth: true,
			processing: true,
			language: {
				url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Chinese.json",
			},
			columns: [
				{
					className: "selector",
					orderable: false,
					defaultContent: '<input type="checkbox" name="selector">',
					title: '<input type="checkbox" name="selectAll">',
				},
				{
					className: "dt-control",
					orderable: false,
					defaultContent: "",
					title: "",
				}, //展开收起按钮
				{ title: "题目内容", className: "QName", data: "QuestionName", orderable: false }, //题目内容
				{ title: "题目类型", className: "QType", data: "QuestionType", orderable: false }, //题目类型
				{
					title: "题目分值",
					className: "QScore editable",
					data: "QuestionScore",
					orderable: false,
				}, //题目分值
				{ title: "是否公开", className: "QPublic", data: "PublicRelease", orderable: false }, //是否公开
				{
					title: "引用次数",
					className: "QReference",
					data: "ReferenceCount",
					orderable: false,
				}, //引用次数
				{
					title: "移除",
					orderable: false,
					defaultContent: '<span class="glyphicon glyphicon-remove remove"></span>',
					className: "QRemove",
				}, //删除
			],
		});
	});

	//返回试卷总览界面
	$(".Return").on("click", function () {
		$.ajax({
			type: "GET",
			url: "PaperManagement?Return=true",
			success: function (response) {
				$(".navSideBar").slideToggle(1);
				$(".CreatePaper").slideToggle(1);
				$(".Return").slideToggle(1);
				$(".mainContainer").toggleClass("WideScreen");
				$(".paperOverview").html(response);
			},
		});
	});

	//从题库中删除题目
	$(".mainContainer").on("click", ".remove", function () {
		var $this = $(this).parent("td");
		previewTable.row.add(SelectedTable.row($this).data()).draw(false);
		SelectedTable.row($this).remove().draw();
	});

	//选择题目加入到试卷中
	$(".mainContainer").on("click", ".select", function () {
		var $this = $(this).parent("td");
		SelectedTable.row.add(previewTable.row($this).data()).draw(false);
		// $.each(SelectedTable.rows()[0], function (key, row) {
		// 	SelectedTable.cell(row, 2).data(SelectedTable.row(row).index() + 1);
		// });
		// SelectedTable.columns(2).data($(this).index()).draw();
		//SelectedTable.row(index).child(format(creatorTable.row(index).index(),creatorTable.row(index).data()[1])).show();	//增加行时同时创建选项子表
		//SelectedTable.row(index-1).child.hide()
		previewTable.row($this).remove().draw();
	});

	function previewFormat(d) {
		var tr = "";
		$.each(d.Option, function (key, value) {
			tr += "                <tr>";
			tr += '                    <td class="AnswerBody">';
			if (value == true) {
				tr +=
					'                        <input type="checkbox" class="PreviewAnswer" name="answer_' +
					d.QuestionID +
					'" checked>';
			} else {
				tr +=
					'                        <input type="checkbox" class="PreviewAnswer" name="answer_' +
					d.QuestionID +
					'" >';
			}
			tr += "					</td>";
			tr += '                    <td class="OptionBody">' + key + "</td>";
			tr += "                </tr>";
		});

		var sb = '    <div class="PreviewOptions">';
		sb += '		<div class="QuestionID">';
		sb += "        	<label>题目ID: </label>";
		sb += "        	<span>" + d.QuestionID + "</span>";
		sb += "		</div>";
		sb += '		<div class="PreviewTable">';
		sb += '        	<table class="table table-striped table-hover">';
		sb += "            	<thead>";
		sb += "                	<tr>";
		sb += '                    	<th class="AnswerHeader">正确答案</th>';
		sb += '                    	<th class="OptionHeader">选项内容</th>';
		sb += "                	</tr>";
		sb += "            	</thead>";
		sb += "            	<tbody>";
		sb += tr;
		sb += "            	</tbody>";
		sb += "        	</table>";
		sb += "		</div>";
		sb += "    </div>";
		return sb;
	}

	$(".mainContainer").on("click", "#QuestionOverviewTable tbody td.dt-control", function () {
		var tr = $(this).closest("tr");
		var row = previewTable.row(tr);

		if (row.child.isShown()) {
			// This row is already open - close it
			row.child.hide();
			tr.removeClass("shown");
		} else {
			// Open this row
			if (row.child() && row.child().length) {
				row.child.show();
			} else {
				row.child(previewFormat(row.data())).show();
			}
			tr.addClass("shown");
		}
		$(".PreviewAnswer").on("click", false); //禁止修改预览题库子表中正确答案的复选框
	});

	$(".mainContainer").on("click", "#SelectedQuestionTable tbody td.dt-control", function () {
		var tr = $(this).closest("tr");
		var row = SelectedTable.row(tr);

		if (row.child.isShown()) {
			// This row is already open - close it
			row.child.hide();
			tr.removeClass("shown");
		} else {
			// Open this row
			if (row.child() && row.child().length) {
				row.child.show();
			} else {
				row.child(previewFormat(row.data())).show();
			}
			tr.addClass("shown");
		}
		$(".PreviewAnswer").on("click", false); //禁止修改预览题库子表中正确答案的复选框
	});

	//修改分值
	$(".mainContainer").on("click", "td.editable", function () {
		var td = $(this);
		var text = td.text().trim();
		var input = $(
			'<input type="number" min="1" value="' + text + '" id="QScoreInput" class="form-control">'
		);
		td.html(input);

		input.on("click", function () {
			return false;
		});
		input.trigger("focus");
		input.on("blur", function () {
			newtext = $(this).val();
			if (newtext < 1) {
				newtext = 1;
			}
			SelectedTable.cell(td).data(newtext).draw();
		});
	});

	//提交试卷
	$(".mainContainer").on("click", ".submit", function () {
		var PaperInfo = {};
		var SelectedQuestion = {};
		$(".paperInfoInput").each(function () {
			PaperInfo[$(this).attr("id")] = $(this).val();
		});
		$.each(SelectedTable.rows().data(), function (index) {
			// console.log(SelectedTable.row(index).data());
			var QuestionID = SelectedTable.row(index).data()["QuestionID"];
			var QuestionScore = SelectedTable.row(index).data()["QuestionScore"];
			SelectedQuestion[QuestionID] = QuestionScore;
		});

		$.ajax({
			type: "POST",
			url: "PaperManagement/createPaper",
			headers: { "X-CSRFToken": csrftoken },
			dataType: "json",
			data: {
				PaperInfo: JSON.stringify(PaperInfo),
				SelectedQuestion: JSON.stringify(SelectedQuestion),
			},
			success: function (response) {
				$(".Return").trigger("click");
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
				toastr.success("创建成功");
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
				console.log(response);
			},
		});
	});

	//初始化日期选择器
	$(".mainContainer").on("creatorLoaded", function () {
		var today = new Date();
		$("#StartTimeSelector").datetimepicker({
			format: "YYYY-MM-DD HH:mm",
			locale: moment.locale("zh-cn"),
			minDate: today,
			//inline: true,
			sideBySide: true,
		});
		$("#EndTimeSelector").datetimepicker({
			format: "YYYY-MM-DD HH:mm",
			locale: moment.locale("zh-cn"),
			minDate: today,
			//inline: true,
			useCurrent: false,
			sideBySide: true,
		});
	});

	$(".mainContainer").on("dp.change", "#StartTimeSelector", function (e) {
		$("#EndTimeSelector").data("DateTimePicker").minDate(e.date);
	});
	$(".mainContainer").on("dp.change", "#EndTimeSelector", function (e) {
		$("#StartTimeSelector").data("DateTimePicker").maxDate(e.date);
	});
});
