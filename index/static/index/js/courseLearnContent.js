$(function () {
    $("[name='Content']").attr({
        "class": "active",
    })


    // 根据所选章获取相应的内容
    function getSections() {
        var Chapter = $('.ChapterSelector').val()
        $.ajax({
            type: "GET",
            url: "Content/GetSection",
            dataType: "json",
            data: { "Chapter": Chapter },
            success: function (response) {
                var content = ''
                $.each(response, function (i, item) {
                    content += '<option value=' + item + '>' + item + '</option>'
                })
                $('.SectionSelector').html(content)
                Section = $('.SectionSelector').val()
                console.log(Section)
                getContent()
            }
        })
    }

    function getContent() {
        var Section = $('.SectionSelector').val()
        $.ajax({
            type: "GET",
            url: "Content/GetContent",
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
                        '<a href="' + value + '">' + key + '</a>'
                        + '</td>' +
                        ' </tr>'
                })
                tab.html(content)
            }
        })
    }
    $('.ChapterSelector').change(getSections)
    $('.SectionSelector').change(getContent)

    getSections()
})