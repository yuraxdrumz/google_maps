$(document).ready(function(){
    var input = document.getElementById('review_search');
    var autocomplete = new google.maps.places.Autocomplete(input,{
        types: ['(cities)']
    });

    $('.review_form').submit(function(){
        var place = autocomplete.getPlace().place_id;
        $('#review_search').val(place);
    });
});


