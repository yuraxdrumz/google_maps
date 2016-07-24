/**
 * Created by Jbt on 22-Jul-16.
 */
(function(){
    window.initMap = function (){
        console.log('initMap()')
        var map = new google.maps.Map(document.getElementById('map'),{
            center:{lat:26,lng:63},
            scrollwheel:false,
            zoom:8
        })
    }
})();
