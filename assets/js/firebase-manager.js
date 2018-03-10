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

let URL_TOURS_DATA ="https://polar-star.firebaseio.com/tours.json";

let vueApp = new Vue({
    el: '#catalog',
    data: {
        search: '',
        countries: [
            {id: 'norway', value: 'Норвегия', status: false},
            {id: 'finland', value: 'Финляндия', status: false},
            {id: 'russia', value: 'Росиия', status: false},
            {id: 'usa', value: 'США', status: false},
            {id: 'canada', value: 'Канада', status: false},
            {id: 'iceland', value: 'Исландия', status: false},
            {id: 'sweden', value: 'Швеция', status: false},
            {id: 'denmark', value: 'Дания', status: false}],
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
        },
        changeCheckboxURL: function (event) {
            if (event) {
                console.log(event.target.id);
            }
        }
    },
    created: function () {
        this.getToursData();
    }
});