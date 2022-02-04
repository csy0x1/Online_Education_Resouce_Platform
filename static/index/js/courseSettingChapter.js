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
                })
                $('#SectionSelector').empty()
                $('#SectionSelector').html(content)
                $('#SectionSelector').selectpicker('refresh')
                $('#currentSection').text($('#SectionSelector').find("option:selected").text())
                //Section = $('#SectionSelector').val()
                //console.log(Section)
                getContent()
            }
        })
    }

    function getContent() {
        var Section = $('#SectionSelector').val()
        console.log("getcon"+Section)
        $.ajax({
            type: "GET",
            url: "Chapter/GetContent",
            dataType: "json",
            data: { "Section": Section },
            success: function (response) {
                console.log(response)
                var content = '<tr>' +
                    '<th>课程资源</th>' +
                    '</tr>'
                var tab = $(".fileTable>tbody")
                $.each(response, function (key, value) {
                    content += ' <tr > ' +
                        '<td class="File">' +
                        '<a href="' + value + '">' + key + '</a>'
                        + '</td>' +
                        ' </tr>'
                })
                tab.html(content)
                $('select').selectpicker('refresh')
            }
        })
        $('#input-CourseFiles').fileinput('clear')
        return Section
    }

    $('#ChapterSelector').change(getSections)
    $('#SectionSelector').change(getContent)

    // $(document).on('click', '.buttontest', function () {
    //     var filename = $(this).parent().prev().text()
    //     console.log("clicked test" + filename)
    // })

    getSections()

    $('#SectionSelector').on("changed.bs.select",
        function (e,clickedIndex) {
            $('#currentSection').text($('#SectionSelector').find("option:selected").text())
        })

    // $("#test").on("click",
    //     function (e){
    //         console.log("this.value"+$('#SectionSelector').find("option:selected").text())
    //
    //     })

    console.log("this.value"+$('#SectionSelector').find("option:selected").text())

    $("#input-CourseFiles").fileinput({     //文件上传
        'language': 'zh',
        allowedFileExtensions: ['mp4', 'mp3', 'pdf', 'png', 'jpg'],//接收的文件后缀
        uploadUrl: 'Chapter',
        uploadExtraData: function (){
            return{
                "chapter":$('#ChapterSelector').val(),
                "section":$('#currentSection').text(),
            }
        },
        ajaxSettings:{
            'headers':{"X-CSRFToken":csrftoken}
            //uploadExtraData:{'section':$('#SectionSelector').val()},
        }
    });


})