// Initialize Firebase
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
const URL_TOURS_IMAGES = firebase.storage().ref('tours');

let vueApp = new Vue({
    el: '#catalog',
    data: {
        tours: []
    },
    methods: {
        getToursData: function () {
            $.ajax({
                url:URL_TOURS_DATA, type:'GET', dataType:'json'
            }).then((resp) => {
                this.tours = resp;
            }).catch((err) => {
                console.log('Error', err.message);
            })
        },
        getImageURL: function (image) {
            return URL_TOURS_IMAGES.child(image+'.jpg').getDownloadURL()
                .then((url) => {
                    console.log(url);
                    // return url;
                    document.getElementById('_'+image).src = url;
            }).catch((err) => {
                console.log('Error', err.message);
            });
        }
    },
    created: function () {
        this.getToursData();
    }
});