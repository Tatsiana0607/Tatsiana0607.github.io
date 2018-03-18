// объект Vue для страницы тура
let vueTour = new Vue({
    el: '#tour',
    data: {
        tour:{},
        styleObject: {
            backgroundImage: '',
            backgroundPosition: 'center center',
            backgroundSize: 'cover'
        }
    },
    methods: {
        getTourData: function(){
            let key = location.search.replace("?name=","");
            $.ajax({
                url:URL_TOURS_DATA+"/"+key+".json",
                type:'GET',
                dataType:'json'
            }).then((result) => {
                this.tour = result;
                this.styleObject.backgroundImage = 'url('+this.tour.mainImg+')';
            }).catch((err) => {
                console.log('Error', err.message);
            });
        }
    },
    created: function () {
        this.getTourData();
    }
});