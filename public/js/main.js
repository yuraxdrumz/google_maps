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
            var myDiv = document.querySelector('.reviews');
            while ( myDiv.firstChild ){
                myDiv.removeChild( myDiv.firstChild );
                console.log('removed');
            }
            var new_center = autocomplete.getPlace().geometry.location;
            var place_id = autocomplete.getPlace().place_id;
            map.setCenter(new_center);

            var marker = new google.maps.Marker({
                position:new_center,
                animation: google.maps.Animation.DROP,
                map:map
            });

            $.get('/loc/' + place_id,function(data){
                var reviews = data;
                for(var i=0,len=reviews.length;i<len;i++){
                    var div = document.createElement('div');
                    var date = document.createElement('div');
                    var place = document.createElement('div');
                    var img = document.createElement('img');
                    var review = document.createElement('div');
                    img.className += 'img_size'
                    var user_name = document.createElement('div');
                    date.innerHTML = reviews[i].date;
                    place.innerHTML = 'place reviewed: ' + reviews[i].place;
                    img.setAttribute('src',reviews[i].img_url);
                    review.innerHTML = reviews[i].review
                    user_name.innerHTML ='by ' + reviews[i].user_fname + ' ' + reviews[i].user_lname;
                    div.appendChild(date)
                    div.appendChild(place)
                    div.appendChild(img)
                    div.appendChild(user_name)
                    div.appendChild(review);
                    div.className += 'single_review'
                    document.querySelector('.reviews').appendChild(div);
                }

            });
        });
    };

});
