
// прелоадер
$(window).on('load', function () {
    var $preloader = $('#page-preloader'),
        $spinner   = $preloader.find('.spinner');
    $spinner.fadeOut();
    $preloader.delay(350).fadeOut('slow');
});


// изменение меню при прокрутке
var changeNavbar = function() {
    if ($(window).scrollTop() > 50 || window.matchMedia("(max-width: 991px)").matches) {
        $('.logo-img-active').css('display', 'inline-block');
        $('.logo-img-main').css('display', 'none');
        $('.navbar').css('background', 'white');
        $('.navbar').css('border-bottom', 'none');
        $('.navbar').css('box-shadow', '0px 0px 8px lightgrey');
        $('nav ul li a').removeClass('color-white');
        $('nav ul li a').addClass('color-heading');
    }
    else {
        $('.logo-img-active').css('display', 'none');
        $('.logo-img-main').css('display', 'inline-block');
        $('.navbar').css('background', 'transparent');
        $('.navbar').css('border-bottom', '1px solid rgba(255, 255, 255, 0.2)');
        $('.navbar').css('box-shadow', 'none');
        $('nav ul li a').removeClass('color-heading');
        $('nav ul li a').addClass('color-white');
    }
}

$(document).ready(function() {

    changeNavbar();

    $(window).scroll(function() {
        changeNavbar();
    });

    $(window).resize(function() {
        changeNavbar();
    });
});


//подключение Google Maps

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

