$(document).ready(function(){
    var input = document.getElementById('review_search');
    var autocomplete = new google.maps.places.Autocomplete(input,{
        types: ['(cities)']
    });

    $('.review_form').submit(function(e){
        var place = autocomplete.getPlace().place_id;
        var place_name = autocomplete.getPlace().name;
        var total = place + '*' + place_name;
        $('#review_search').val(total);
    });
});



