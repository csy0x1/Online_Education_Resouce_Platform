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

	$("[role='QuestionBankManagement']").attr({
		class: "active",
	});

	var previewTable;
	var creatorTable = $("#CreatorTable").DataTable({
		dom: '<"TableTop"f>rt<"TableBottom"lip><"clear">',
		lengthMenu: [
			[5, 10, 25, -1],
			[5, 10, 25, "全部"],
		],
		order: [[1, "asc"]],
		language: {
			url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Chinese.json",
		},
		columns: [
			{
				className: "dt-control",
				orderable: false,
				defaultContent: "",
				title: "",
			}, //展开收起按钮
			{ title: "题目内容", className: "editable QName" }, //题目内容
			{ title: "题目类型", className: "editable QType" }, //题目类型
			{ title: "题目分值", className: "editable QScore" }, //题目分值
			{ title: "是否公开", className: "editable QPublic" }, //是否公开
			{
				title: "删除",
				orderable: false,
				defaultContent: '<span class="glyphicon glyphicon-remove remove"></span>',
				className: "QDelete",
			}, //删除
		],
	});
	var counter = 1;
	var index = counter - 1;
	$("#addRow").on("click", function () {
		creatorTable.row.add([null, counter + ".1", "单选", "10", "公开", null]).draw(false);
		creatorTable
			.row(index)
			.child(format(creatorTable.row(index).index(), creatorTable.row(index).data()[1]))
			.show(); //增加行时同时创建选项子表
		creatorTable.row(index - 1).child.hide();

		counter++;
		index++;
	});

	$(".mainContainer").on("click", ".remove", function () {
		creatorTable.row($(this).parents("td")).remove().draw();
		index--;
	});

	$("#submit").on("click", function () {
		var data = {};
		var options = {};

		$.each(creatorTable.rows().data(), function (index) {
			$.each(creatorTable.row(index).child(), function (key, value) {
				var key = $(value).find(".optionTr");
				var temp = {};
				$.each(key, function (i, j) {
					var Answer = $(j).find(".Answer").is(":checked");
					var Option = $(j).find(".Option").val();
					temp[Option] = Answer;
					options[index] = temp;
				});
			});
		});
		var jsonOptions = JSON.stringify(options);

		$.each(creatorTable.rows().data(), function (index, value) {
			data[index] = value;
		});
		var jsonData = JSON.stringify(data);

		$.ajax({
			type: "POST",
			url: "QuestionBank",
			dataType: "json",
			headers: { "X-CSRFToken": csrftoken },
			data: {
				data: jsonData,
				options: jsonOptions,
				operationType: "create",
			},
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
					creatorTable.clear().draw(true);
					previewTable.ajax.url("QuestionBank/getQuestionBank").load();
				};
				toastr.success("提交成功");
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
		//console.log(jsonData);
	});

	function format(d, question) {
		//子表
		var td = '                <tr class="optionTr">';
		td += '                    <td class="AnswerTd">';
		td +=
			'                        <input type="radio" class="Answer" name="answer_' +
			d +
			'" value="1">';
		td += "                    </td>";
		td += '                    <td class="OptionTd">';
		td +=
			'                        <input type="text" class="Option form-control" name="Option_' +
			d +
			'" placeholder="选项">';
		td += "                    </td>";
		td += "                </tr>";

		var sb = "";
		sb += '    <div class="Options">';
		sb += '        <div class="questionDiv">';
		sb += '            <label class="questionLabel">题目内容</label>';
		sb +=
			'            <textarea class="form-control" id="SubtableQuestion" placeholder="题目内容" value="' +
			question +
			'"></textarea>';
		sb += "        </div>";
		sb += '        <table class="table table-striped table-hover">';
		sb += "            <thead>";
		sb += "                <tr>";
		sb += "                    <th>正确答案</th>";
		sb += "                    <th>选项内容</th>";
		sb += "                </tr>";
		sb += "            </thead>";
		sb += "            <tbody>";
		sb += td;
		sb += td;
		sb += td;
		sb += td;
		sb += "            </tbody>";
		sb += "        </table>";
		sb += "    </div>";
		return sb;
	}

	$("#CreatorTable tbody").on("click", "td.dt-control", function () {
		var tr = $(this).closest("tr");
		var row = creatorTable.row(tr);

		if (row.child.isShown()) {
			// This row is already open - close it
			row.child.hide();
			tr.removeClass("shown");
		} else {
			// Open this row
			if (row.child() && row.child().length) {
				row.child.show();
			} else {
				row.child(format(row.index())).show();
			}
			tr.addClass("shown");
		}
	});

	$("#CreatorTable>tbody").on("click", "tr > .editable", function () {
		var td = $(this);
		var text = td.text().trim();
		var select = '                <select id="QTypeInput">';
		select += '                    <option value="single">单选</option>';
		select += '                    <option value="multi">多选</option>';
		select += "                </select>";
		if (td.hasClass("QType")) {
			var input = $(select);
			td.html(input);
		} else if (td.hasClass("QPublic")) {
			var select = '                <select id="QPublicInput">';
			select += '                    <option value="public">公开</option>';
			select += '                    <option value="private">内部</option>';
			select += "                </select>";
			var input = $(select);
			td.html(input);
		} else if (td.hasClass("QName")) {
			var input = $('<input type="text" value="' + text + '" id="QNameInput">');
			td.html(input);
		} else if (td.hasClass("QScore")) {
			var input = $('<input type="text" value="' + text + '" id="QScoreInput">');
			td.html(input);
		}

		input.on("click", function () {
			return false;
		});
		input.trigger("focus");
		input.on("blur", function () {
			var newtext = $(this).find("option:selected").text();
			if (newtext == "") {
				newtext = $(this).val();
				if ($(this).attr("id") == "QNameInput") {
					//主表中题目内容与子表中的同步
					var subQuestion = creatorTable.row($(this).parent()).child().find("#SubtableQuestion");
					$(subQuestion).val(newtext);
				}
			} else if ($(this).attr("id") == "QTypeInput") {
				//根据选择的题目类型，改变子表
				if ($(this).find("option:selected").text() == "单选") {
					var subtable = creatorTable.row(td).child();
					$.each(subtable.find("input"), function (i) {
						if ($(this).attr("type") == "checkbox") {
							$(this).attr("type", "radio");
						}
					});
				} else if ($(this).find("option:selected").text() == "多选") {
					var subtable = creatorTable.row(td).child();
					$.each(subtable.find("input"), function (i) {
						if ($(this).attr("type") == "radio") {
							$(this).attr("type", "checkbox");
						}
					});
				}
			}
			//td.html(newtext)
			creatorTable.cell(td).data(newtext).draw();
		});
	});

	$(".mainContainer").on("change", "#SubtableQuestion", function () {
		//子表中题目内容与主表中的同步
		var newtext = $(this).val();
		var QuestionHeader = $($(this).closest("tr").prev()[0]).children()[1];
		creatorTable.cell($(QuestionHeader)).data(newtext).draw();
	});

	previewTable = $("#QuestionPreviewTable").DataTable({
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
				defaultContent: "",
				title: "",
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
				title: "删除",
				orderable: false,
				defaultContent: '<span class="glyphicon glyphicon-remove delete"></span>',
				className: "QDelete",
			}, //删除
		],
	});

	$(".mainContainer").on("click", ".delete", function () {
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

	$("#QuestionPreviewTable tbody").on("click", "td.dt-control", function () {
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
});
