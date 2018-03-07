const URL_TOURS ="https://polar-star.firebaseio.com/tours.json";

let vueApp = new Vue({
    el: '#catalog',
    data: {
        tours: []
    },
    methods: {
        getTours: function () {
            $.ajax({
                url:URL_TOURS, type:'GET', dataType:'json'
            }).then((resp) => {
                this.tours = resp;
            }).catch((err) => {
                console.log('Error', err.message);
            })
        }
    },
    created: function () {
        this.getTours();
    }
});