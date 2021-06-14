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
        var Chapter = $('.ChapterSelector').val()
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

    function submitForm() {
        var Section = $('.SectionSelector').val()
        var form = new FormData()
        var f_obj = $('[name="courseFile"]')[0].files
        for (i = 0; i < f_obj.length; i++) {
            var files = $('[name="courseFile"]')[0].files[i]
            form.append("file_obj", files)
        }
        form.append("section", Section)
        form.append("X-CSRFToken", csrftoken)
        $.ajax({
            type: "POST",
            url: "Chapter",
            dataType: "json",
            headers: { 'X-CSRFToken': csrftoken },
            data: form,
            processData: false,
            contentType: false,
            success: function (response) {

            }
        })
    }

    $('#submit').click(submitForm)
})