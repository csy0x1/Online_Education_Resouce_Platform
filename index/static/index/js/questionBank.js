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

	var table = $("#QuestionBankTable").DataTable({
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
            {title:"题目名称", "className":"editable QName"}, //题目名称
            {title:"题目类型", "className":"editable QType"}, //题目类型
            {title:"题目分值", "className":"editable QScore"}, //题目分值
            {title:"是否公开", "className":"editable QPublic"}, //是否公开

        ],
	});
	var counter = 1;

	$("#addRow").on("click", function () {
		table.row.add( [
			null,
            counter +'.1',
            "单选",
            "10",
            "公开",
        ] ).draw( false );
		var index = counter-1
		table.row(index).child(format(table.row(index).index())).show();	//增加行时同时创建选项子表

		counter++;
	});

	$("#submit").on("click", function () {
		console.log("clicked")
		var data = {}
		var options = {}

		$.each(table.rows().data(),function(index){
			$.each(table.row(index).child(),function(key,value){
				var key = $(value).find(".optionDiv")
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

		$.each(table.rows().data(), function (index, value) {
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
			},
			success:function (response) {
				console.log(response);
				table.clear().draw(true);
				}
		});
		//console.log(jsonData);
	});

	function format(d) {	//子表
		console.log("d",d)
		var subtable='    <div class="Options">';
			subtable+='        <div class="optionDiv"> ';
			subtable+='            <input type="checkbox" class="Answer" name="Answer_'+d+'"><input type="text" class="Option" name="Option_'+d+'">';
			subtable+='        </div>';
			subtable+='        <div class="optionDiv"> ';
			subtable+='            <input type="checkbox" class="Answer" name="Answer_'+d+'"><input type="text" class="Option" name="Option_'+d+'">';
			subtable+='        </div>';
			subtable+='        <div class="optionDiv"> ';
			subtable+='            <input type="checkbox" class="Answer" name="Answer_'+d+'"><input type="text" class="Option" name="Option_'+d+'">';
			subtable+='        </div>';
			subtable+='        <div class="optionDiv"> ';
			subtable+='            <input type="checkbox" class="Answer" name="Answer_'+d+'"><input type="text" class="Option" name="Option_'+d+'">';
			subtable+='        </div>';
			subtable+='    </div>';
		return subtable;
	}

    $('#QuestionBankTable tbody').on('click', 'td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );
 
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

	$("#QuestionBankTable>tbody").on("click", "tr > .editable", function () {
		var td = $(this)
		var text = td.text().trim()
		var select='                <select class="QType">';
			select+='                    <option value="single">单选</option>';
			select+='                    <option value="multi">多选</option>';
			select+='                </select>';
		if(td.hasClass("QType")){
			var input = $(select)
			td.html(input)
		}
		else if(td.hasClass("QPublic")){
			var select='                <select class="QPublic">';
				select+='                    <option value="public">公开</option>';
				select+='                    <option value="private">内部</option>';
				select+='                </select>';
			var input = $(select)
			td.html(input)
		}
		else{
			var input = $('<input type="text" value="' + text + '">')
			td.html(input)
		}

		input.on("click",function(){return false})
		input.trigger("focus")
		input.on("blur",function(){
			console.log(this)
			var newtext = $(this).find("option:selected").text()
			if(newtext==""){
				newtext = $(this).val()
			}
			else if($(this).attr("class")=="QType"){
				if($(this).find("option:selected").text()=="单选"){
					var subtable = table.row(td).child()
					$.each(subtable.find("input"),function(i){
						if($(this).attr("type")=="checkbox"){
							$(this).attr("type","radio")
						}
					})
				}
				else{
					var subtable = table.row(td).child()
					$.each(subtable.find("input"),function(i){
						if($(this).attr("type")=="radio"){
							$(this).attr("type","checkbox")
						}
					})
				}
			}
			//td.html(newtext)
			table.cell(td).data(newtext).draw()
		})
	})
});
