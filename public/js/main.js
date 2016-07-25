$(document).ready(function(){
    window.initMap = function(){
        var map = new google.maps.Map(document.getElementById('map'),{
            center:{lat:26,lng:63},
            scrollwheel:true,
            zoom:8
        })

        var input = document.getElementById('search')
        var autocomplete = new google.maps.places.Autocomplete(input,{
            types: ['(cities)']
        });
        autocomplete.addListener('place_changed',function(){
            var new_center = autocomplete.getPlace().geometry.location;
            var place_id = autocomplete.getPlace().place_id;
            map.setCenter(new_center);

            $.get('/loc/' + place_id,function(data){
                var reviews = data;
                console.log(data)
            });
        });
    };
});
