
window.initMap = function() {
    var customMapType = new google.maps.StyledMapType([
    {
        stylers: [
            {'saturation': -100},
            {'lightness': 20},
        ]
    }]);

    var customMapTypeId = 'custom_style';

    var image = new google.maps.MarkerImage(
  	'assets/img/gmap-pin.png',
  	new google.maps.Size(48,54),
  	new google.maps.Point(0,0)
	);

    var minsk = {lat: 53.9034, lng: -332.4422};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: minsk,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, customMapTypeId]
        }
    });

    var contentString = '<h4 id="firstHeading" class="firstHeading">Офис в Минске</h4>' +
                        '<p>Площадь Свободы 23, офис 35А<br>Минск 220030<br>Беларусь</p>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    var marker = new google.maps.Marker({
        map: map,
        clickable: true,
        icon: image,
        position: minsk
    });

    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

    map.mapTypes.set(customMapTypeId, customMapType);
    map.setMapTypeId(customMapTypeId);
}