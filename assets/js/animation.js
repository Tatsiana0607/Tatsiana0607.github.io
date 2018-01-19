
// изменение меню при прокрутке
var navbarOnScroll = function() {
    if ($(window).scrollTop() > 50) {
        $('.logo-img-active').css('display', 'inline-block');
        $('.logo-img-main').css('display', 'none');
        $('.navbar').css('background', 'white');
        $('.navbar').css('border-bottom', 'none');
        $('.navbar').css('box-shadow', '0px 0px 8px lightgrey');
        $('.nav li a').removeClass('color-white');
        $('.nav li a').addClass('color-heading');
    }
    else {
        $('.logo-img-active').css('display', 'none');
        $('.logo-img-main').css('display', 'inline-block');
        $('.navbar').css('background', 'transparent');
        $('.navbar').css('border-bottom', '1px solid rgba(255, 255, 255, 0.2)');
        $('.navbar').css('box-shadow', 'none');
        $('.nav li a').removeClass('color-heading');
        $('.nav li a').addClass('color-white');
    }
}

$(document).ready(function() {

    navbarOnScroll();

    $(window).scroll(function() {
        navbarOnScroll();
    });
});

