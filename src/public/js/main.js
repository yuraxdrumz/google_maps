$(document).ready( function() {
    var socket = io();
    var cleanScreen = function (div_name) {
        var myDiv = document.querySelector(div_name);
            while (myDiv.firstChild) {
                myDiv.removeChild(myDiv.firstChild);
        };
    };

    socket.on('message', function (msg) {
        var $div = $('<div>');
        $div.addClass('new-message-recived');
        $('.who-connected').append($div.text(msg));
    });

    $('.send-msg').on('click', function (event) {
        event.preventDefault();
        var msg = $('#msg').val();
        socket.emit('message',msg);
        $('#msg').val('');
        return false;
    })

    $(".over").animate({"right":"0px"}, "slow");

    window.initMap = function () {
        var map = new google.maps.Map(document.getElementById('map'),{
            center:{lat:26,lng:63},
            scrollwheel:true,
            zoom:8
        });
        var input = document.getElementById('search');
        var autocomplete = new google.maps.places.Autocomplete(input,{
            types: ['(cities)']
        });
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

        autocomplete.addListener('place_changed', function () {
            $(".over").css('display','none');
            $('.over').css('right','-200px');
            $('.over').css('display','flex');
            $(".over").animate({"right":"0px"}, "slow");

            cleanScreen('.reviews');
            cleanScreen('.who-connected');

            var new_center = autocomplete.getPlace().geometry.location;
            var place_id = autocomplete.getPlace().place_id;
            map.setCenter(new_center);

            socket.emit('change-room',place_id);

            var marker = new google.maps.Marker({
                position:new_center,
                animation: google.maps.Animation.DROP,
                map:map
            });

            $.get('/loc/' + place_id, function (data) {
                var reviews = data;
                for (var i=0,len=reviews.length;i<len;i++) {
                    var div = document.createElement('div');
                    var date = document.createElement('div');
                    var place = document.createElement('div');
                    var img = document.createElement('img');
                    var review = document.createElement('div');
                    img.className += 'img_size';
                    var user_name = document.createElement('div');
                    var createDate = moment(reviews[i].date).format("dddd, MMMM Do YYYY, h:mm:ss a");
                    date.innerHTML = createDate;
                    place.innerHTML = 'place reviewed: ' + reviews[i].place;
                    img.style.background = 'url('+reviews[i].img_url+') 50% 50% no-repeat';
                    img.style.backgroundSize = 'cover';
                    review.innerHTML = reviews[i].review;
                    review.style.wordWrap = 'break-word';
                    review.style.overflow = 'auto';
                    user_name.innerHTML ='by: ' + reviews[i].user_fname + ' ' + reviews[i].user_lname;
                    div.appendChild(date);
                    div.appendChild(place);
                    div.appendChild(img);
                    div.appendChild(user_name);
                    div.appendChild(review);
                    div.className += 'single_review';
                    document.querySelector('.reviews').appendChild(div);
                };
            });
        });
    };
});
