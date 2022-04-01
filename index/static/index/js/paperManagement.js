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

	var PaperInfoCard = $(".PaperInfoCard").html();
	var previewTable, SelectedTable;
	$(".CreatePaper").on("click", function () {
		$.ajax({
			type: "GET",
			url: "PaperManagement/createPaper",
			success: function (response) {
				$(".navSideBar").slideToggle(1);
				$(".CreatePaper").slideToggle(1);
				$(".Return").slideToggle(1);
				$(".mainContainer").toggleClass("WideScreen");
				$(".paperOverview").html(response);
				previewTable = $("#QuestionOverviewTable").DataTable({
					//题库表初始化
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
						{ title: "题目分值", className: "QScore", data: "QuestionScore", orderable: false }, //题目分值
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
							defaultContent: '<span class="glyphicon glyphicon-remove select"></span>',
							className: "QSelect",
						}, //删除
					],
				});
			},
		});
		return false;
	});

	$(".Return").on("click", function () {
		$(".navSideBar").slideToggle(1);
		$(".CreatePaper").slideToggle(1);
		$(".Return").slideToggle(1);
		$(".mainContainer").toggleClass("WideScreen");
		$(".paperOverview").html(PaperInfoCard);
	});

	$(".mainContainer").on("click", ".remove", function () {
		//从题库中删除题目
		var $this = $(this).parent("td");
		$.ajax({
			type: "POST",
			url: "QuestionBank/getQuestionBank",
			headers: { "X-CSRFToken": csrftoken },
			dataType: "json",
			data: {
				operationType: "delete",
				deleteRow: JSON.stringify(previewTable.row($this).data()),
			},
			success: function (response) {
				console.log(response);
				previewTable.row($this).remove().draw();
			},
		});
	});

	$(".mainContainer").on("click", ".select", function () {
		//选择题目加入到试卷中
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
});