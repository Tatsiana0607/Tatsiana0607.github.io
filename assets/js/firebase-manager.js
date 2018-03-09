// Инициализация Firebase
const config = {
    apiKey: "AIzaSyD6ATxEe58Kw1MypGzHn2wTqPtHJjLe7Dg",
    authDomain: "polar-star.firebaseapp.com",
    databaseURL: "https://polar-star.firebaseio.com",
    projectId: "polar-star",
    storageBucket: "polar-star.appspot.com",
    messagingSenderId: "185259417758"
};
firebase.initializeApp(config);

const URL_TOURS_DATA ="https://polar-star.firebaseio.com/tours.json";

let vueApp = new Vue({
    el: '#catalog',
    data: {
        tours: []
    },
    methods: {
        getToursData: function () {
            $.ajax({
                url:URL_TOURS_DATA, type:'GET', dataType:'json'
            }).then((result) => {
                this.tours = result;
            }).catch((err) => {
                console.log('Error', err.message);
            })
        }
    },
    created: function () {
        this.getToursData();
    }
});