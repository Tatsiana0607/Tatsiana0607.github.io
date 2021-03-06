﻿
//инициализация WOW
var wow = new WOW(
    {
        mobile: false,
        tablet: false
    }
);
wow.init();

// прелоадер
$(window).on('load', function () {
    var $preloader = $('#page-preloader'),
        $spinner   = $preloader.find('.spinner');
    $spinner.fadeOut();
    $preloader.delay(200);
    $('body').removeClass('loading');
    $preloader.fadeOut(500);
});

// изменение меню при прокрутке и на средних и малых устройствах
function changeNavbar() {
    if ($(window).scrollTop() > 50 || window.matchMedia("(max-width: 991px)").matches) {
        $('.logo-img-active').css('display', 'inline-block');
        $('.logo-img-main').css('display', 'none');
        $('.navbar').css('background', 'white').css('border-bottom', 'none').css('box-shadow', '0px 0px 8px lightgrey');
        $('.dropdown-divider').css('border-top', '1px solid rgba(0, 0, 0, 0.1)');
        $('.profile-photo').css('border', '2px solid #515769');
        $('.dropdown-menu').css('background', 'rgba(255, 255, 255, 1)').css('border', '1px solid rgba(0, 0, 0, 0.1)');
        $('nav ul li a').removeClass('color-white').addClass('color-heading');
        $('.dropdown-menu a').removeClass('color-white').addClass('color-heading');
        $('.dropdown-toggle').removeClass('color-white').addClass('color-heading');

    }
    else {
        $('.logo-img-active').css('display', 'none');
        $('.logo-img-main').css('display', 'inline-block');
        $('.navbar').css('background', 'transparent').css('box-shadow', 'none');
        $('.dropdown-divider').css('border-top', '1px solid rgba(255, 255, 255, 0.2)');
        $('.profile-photo').css('border', 'solid white 2px');
        $('.dropdown-menu').css('background', 'rgba(255, 255, 255, 0.2)').css('border', '1px solid rgba(255, 255, 255, 0.2)');
        $('nav ul li a').removeClass('color-heading').addClass('color-white');
        $('.dropdown-menu a').removeClass('color-heading').addClass('color-white');
        $('.dropdown-toggle').removeClass('color-heading').addClass('color-white');

    }
}


// подключение Google Maps
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


function showButton() {
    if ($(window).scrollTop() > 200 && $(window).scrollTop() < $('body').height()-1000) {
        $('#open-btn').css('opacity','1');
    }
    else {
        $('#open-btn').css('opacity','0');
    }
}


function toggleSidebar() {
    if(document.getElementById("mySidenav").style.width === "300px"){
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("catalog").style.marginLeft= "0";
        document.getElementById("open-btn").style.marginLeft = "0";
        $('.fa-caret-right').removeClass('hide');
        $('.fa-caret-left').addClass('hide');
    }
    else{
        document.getElementById("mySidenav").style.width = "300px";
        document.getElementById("catalog").style.marginLeft = "300px";
        document.getElementById("open-btn").style.marginLeft = "300px";
        $('.fa-caret-right').addClass('hide');
        $('.fa-caret-left').removeClass('hide');
    }
}


$(document).ready(function() {
    changeNavbar();
    showButton();
    $(window).scroll(function(){
        changeNavbar();
        showButton();
    });
    $(window).resize(function () {
        changeNavbar();
    });

    // кнопка back-to-top
    var offset = 300, scrollDuration = 700, backToTop = $('.back-to-top');

    $(window).scroll(function(){
        if ($(this).scrollTop() > offset )
            backToTop.addClass('visible');
        else backToTop.removeClass('visible');
    });

    backToTop.on('click', function(event){
        event.preventDefault();
        $('body,html').animate({scrollTop: 0}, scrollDuration);
    });
});




