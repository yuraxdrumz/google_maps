$(document).ready( function () {
    var input = document.getElementById('review_search');
    var autocomplete = new google.maps.places.Autocomplete(input,{
        types: ['(cities)']
    });


    $('.review_form').submit( function () {
        var place = autocomplete.getPlace().place_id;
        var place_name = autocomplete.getPlace().name;
        var total = place + '*' + place_name;
        $('#review_search').val(total);
    });

    $('#dropzone input').on('change', function(event) {
        var file = this.files[0];
        $('#dropzone').removeClass('hover');
        if (this.accept && $.inArray(file.type, this.accept.split(/, ?/)) === -1) {
            return alert('File type not allowed.');
        }
        $('#dropzone').addClass('dropped');
        $('#dropzone img').remove();

        if ((/^image\/(gif|png|jpeg)$/i).test(file.type)) {
            var reader = new FileReader(file);
            reader.readAsDataURL(file);

            reader.onload = function(event) {
                var data = event.target.result,
                $img = $('<img />').attr('src', data).fadeIn();
                $('#dropzone div').html($img);
            };
        } else {
            var ext = file.name.split('.').pop();
            $('#dropzone div').html(ext);
        }
    });
});



