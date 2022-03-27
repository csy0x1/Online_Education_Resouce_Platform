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

	var creatorTable = $("#CreatorTable").DataTable({
		"lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "全部"]],
		language: {
			url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Chinese.json",
		},
        "columns": [
            {
                "className":      'dt-control',
                "orderable":      false,
                "defaultContent": '',
				title:"",
            },  //展开收起按钮
            {title:"题目内容", "className":"editable QName"}, //题目内容
            {title:"题目类型", "className":"editable QType"}, //题目类型
            {title:"题目分值", "className":"editable QScore"}, //题目分值
            {title:"是否公开", "className":"editable QPublic"}, //是否公开
			{
				title:"删除",
				"orderable":      false,
				"defaultContent": '<span class="glyphicon glyphicon-remove remove"></span>',
				"className":"QDelete"
			},	//删除

        ],
	});
	var counter = 1;
	var index = counter-1
	$("#addRow").on("click", function () {
		creatorTable.row.add( [
			null,
            counter +'.1',
            "单选",
            "10",
            "公开",
			null
        ] ).draw( false );
		creatorTable.row(index).child(format(creatorTable.row(index).index(),creatorTable.row(index).data()[1])).show();	//增加行时同时创建选项子表
		creatorTable.row(index-1).child.hide()

		counter++;
		index++;
	});

	$(".mainContainer").on("click",".remove",function(){
		console.log("remove")
		creatorTable.row( $(this).parents('td') ).remove().draw();
		index--
	})

	$("#submit").on("click", function () {
		console.log("clicked")
		var data = {}
		var options = {}

		$.each(creatorTable.rows().data(),function(index){
			$.each(creatorTable.row(index).child(),function(key,value){
				var key = $(value).find(".optionTr")
				var temp = {}
				$.each(key,function(i,j){
					var Answer = $(j).find(".Answer").is(':checked')
					var Option = $(j).find(".Option").val()
					temp[Option] = Answer
					options[index] = temp
				})
			})
		})
		var jsonOptions = JSON.stringify(options)

		$.each(creatorTable.rows().data(), function (index, value) {
			data[index] = value
		});
		var jsonData = JSON.stringify(data);

		$.ajax({
			type: "POST",
			url: "QuestionBank",
			dataType: "json",
			headers: { "X-CSRFToken": csrftoken },
			data: {
				 data: jsonData ,
				 options: jsonOptions,
				 operationType: "create"
			},
			success:function (response) {
				console.log(response);
				creatorTable.clear().draw(true);
				}
		});
		//console.log(jsonData);
	});

	function format(d,question) {	//子表
		var td = '                <tr class="optionTr">';
			td+='                    <td class="AnswerTd">';
			td+='                        <input type="radio" class="Answer" name="answer_'+d+'" value="1">';
			td+='                    </td>';
			td+='                    <td class="OptionTd">';
			td+='                        <input type="text" class="Option form-control" name="Option_'+d+'" placeholder="选项">';
			td+='                    </td>';
			td+='                </tr>';

		var sb='';
			sb+='    <div class="Options">';
			sb+='        <div class="questionDiv">';
			sb+='            <label class="questionLabel">题目内容</label>';
			sb+='            <input type="text" class="form-control" id="SubtableQuestion" placeholder="题目内容" value="'+question+'">';
			sb+='        </div>';
			sb+='        <table class="table table-striped table-hover">';
			sb+='            <thead>';
			sb+='                <tr>';
			sb+='                    <th>正确答案</th>';
			sb+='                    <th>选项内容</th>';
			sb+='                </tr>';
			sb+='            </thead>';
			sb+='            <tbody>';
			sb+=td;
			sb+=td;
			sb+=td;
			sb+=td;
			sb+='            </tbody>';
			sb+='        </table>';
			sb+='    </div>';
		return sb;
	}

    $('#CreatorTable tbody').on('click', 'td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = creatorTable.row( tr );
 
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
			if(row.child() && row.child().length)
			{
				row.child.show();
			}
			else {
				row.child( format(row.index()) ).show();
			}
			tr.addClass('shown');
        }
    } );

	$("#CreatorTable>tbody").on("click", "tr > .editable", function () {
		var td = $(this)
		var text = td.text().trim()
		var select='                <select id="QTypeInput">';
			select+='                    <option value="single">单选</option>';
			select+='                    <option value="multi">多选</option>';
			select+='                </select>';
		if(td.hasClass("QType")){
			var input = $(select)
			td.html(input)
		}
		else if(td.hasClass("QPublic")){
			var select='                <select id="QPublicInput">';
				select+='                    <option value="public">公开</option>';
				select+='                    <option value="private">内部</option>';
				select+='                </select>';
			var input = $(select)
			td.html(input)
		}
		else if(td.hasClass("QName")){
			var input = $('<input type="text" value="' + text + '" id="QNameInput">')
			td.html(input)
		}
		else if(td.hasClass("QScore")){
			var input = $('<input type="text" value="' + text + '" id="QScoreInput">')
			td.html(input)
		}

		input.on("click",function(){return false})
		input.trigger("focus")
		input.on("blur",function(){
			var newtext = $(this).find("option:selected").text()
			if(newtext==""){
				newtext = $(this).val()
				if($(this).attr("id")=="QNameInput"){	//主表中题目内容与子表中的同步
					var subQuestion = creatorTable.row($(this).parent()).child().find("#SubtableQuestion")
					$(subQuestion).val(newtext)
				}
			}
			else if($(this).attr("id")=="QTypeInput"){	//根据选择的题目类型，改变子表
				if($(this).find("option:selected").text()=="单选"){
					var subtable = creatorTable.row(td).child()
					$.each(subtable.find("input"),function(i){
						if($(this).attr("type")=="checkbox"){
							$(this).attr("type","radio")
						}
					})
				}
				else if($(this).find("option:selected").text()=="多选"){
					var subtable = creatorTable.row(td).child()
					$.each(subtable.find("input"),function(i){
						if($(this).attr("type")=="radio"){
							$(this).attr("type","checkbox")
						}
					})
				}
			}
			//td.html(newtext)
			creatorTable.cell(td).data(newtext).draw()
		})
	})

	$(".mainContainer").on("change","#SubtableQuestion",function(){		//子表中题目内容与主表中的同步
		var newtext = $(this).val()
		var QuestionHeader = $($(this).closest("tr").prev()[0]).children()[1]
		creatorTable.cell($(QuestionHeader)).data(newtext).draw()
	})

	var previewTable = $('#QuestionPreviewTable').DataTable({
		"processing": true,
		language: {
			url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Chinese.json",
		},
		ajax: "QuestionBank/getQuestionBank",
		"columns": [
			{
				"className":      'selector',
				"orderable":      false,
				"defaultContent": '',
				"title":'',
			},
            {
                "className":      'dt-control',
                "orderable":      false,
                "defaultContent": '',
				title:"",
            },  //展开收起按钮
            {title:"题目内容", "className":"QName", "data":"QuestionName"}, //题目内容
            {title:"题目类型", "className":"QType","data":"QuestionType"}, //题目类型
            {title:"题目分值", "className":"QScore","data":"QuestionScore"}, //题目分值
            {title:"是否公开", "className":"QPublic","data":"PublicRelease"}, //是否公开
			{
				title:"删除",
				"orderable":      false,
				"defaultContent": '<span class="glyphicon glyphicon-remove remove"></span>',
				"className":"QDelete"
			},	//删除

        ],
	})
});
