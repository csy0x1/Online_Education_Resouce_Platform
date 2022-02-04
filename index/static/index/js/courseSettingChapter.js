$(function () {

    $("[role='chapterManagement']").attr({
        "class": "active",
    })


    function getCookie(name) {      //获取CSRF令牌
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    // 根据所选章获取相应的内容
    function getSections() {
        var Chapter = $('#ChapterSelector').val()
        $.ajax({
            type: "GET",
            url: "Chapter/GetSection",
            dataType: "json",
            data: { "Chapter": Chapter },
            success: function (response) {
                var content = ''
                $.each(response, function (i, item) {
                    content += '<option value=' + item + '>' + item + '</option>'
                    // $('#SectionSelector').append(
                    //     $("<option></option>").attr(
                    //         "value", item).text(item)
                    // )
                })
                $('#SectionSelector').empty()
                $('#SectionSelector').html(content)
                $('#SectionSelector').selectpicker('refresh')
                //Section = $('#SectionSelector').val()
                //console.log(Section)
                getContent()
            }
        })
    }

    function getContent() {
        var Section = $('#SectionSelector').val()
        $.ajax({
            type: "GET",
            url: "Chapter/GetContent",
            dataType: "json",
            data: { "Section": Section },
            success: function (response) {
                var content = '<tr>' +
                    '<th>课程资源</th>' +
                    '</tr>'
                var tab = $(".fileTable>tbody")
                $.each(response, function (key, value) {
                    content += ' <tr > ' +
                        '<td class="File">' +
                        '<a href="' + value + '">' + key + '</a>' +
                        '<div class="test">' +
                        '<button class="buttontest">' +
                        '测试</button>' +
                        '</div>' +
                        '</td>' +
                        ' </tr>'

                })
                tab.html(content)
                $('select').selectpicker('refresh')
            }
        })
    }
    $('#ChapterSelector').change(getSections)
    $('#SectionSelector').change(getContent)

    $(document).on('click', '.buttontest', function () {
        var filename = $(this).parent().prev().text()
        console.log("clicked test" + filename)
    })


    getSections()

    function submitForm(operation = 0, filename = "null") {
        var Section = $('#SectionSelector').val()
        var form = new FormData()
        var f_obj = $('[name="courseFile"]')[0].files
        var params =
        {
            type: "POST",
            url: "Chapter",
            dataType: "json",
            headers: { 'X-CSRFToken': csrftoken },
            data: form,
            processData: false,
            contentType: false,
            operation: 0,
        }

        for (i = 0; i < f_obj.length; i++) {
            var files = $('[name="courseFile"]')[0].files[i]
            form.append("file_obj", files)
        }
        form.append("section", Section)
        form.append("X-CSRFToken", csrftoken)
        $.ajax(params)
        $.ajaxSuccess()
    }


    $("#id_Course_Files").fileinput({     //文件上传
        'language': 'zh',
        allowedFileExtensions: ['mp4', 'mp3', 'pdf', 'png', 'jpg'],//接收的文件后缀
    });


    $('#submit').click(submitForm)
})