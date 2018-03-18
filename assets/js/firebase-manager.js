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

const URL_TOURS_DATA ="https://polar-star.firebaseio.com/tours";
const TEMP_FILES_REF = firebase.storage().ref('temp');
const TOURS_FILES_REF = firebase.storage().ref('tours/');

//Общее хранилище
var storage = {
    countries: [
        {id: 'norway', value: 'Норвегия'},
        {id: 'finland', value: 'Финляндия'},
        {id: 'russia', value: 'Россия'},
        {id: 'usa', value: 'США'},
        {id: 'canada', value: 'Канада'},
        {id: 'iceland', value: 'Исландия'},
        {id: 'sweden', value: 'Швеция'},
        {id: 'denmark', value: 'Дания'}],
    tours: [],
    getToursData: function(){
        $.ajax({
            url:URL_TOURS_DATA+'.json',
            type:'GET',
            dataType:'json'
        }).then((result) => {
            this.tours = Object.values(result).sort(function (a, b) {
                if (a.creationDate > b.creationDate) {return 1;}
                if (a.creationDate < b.creationDate) {return -1;}
                return 0;
            });
        }).catch((err) => {
            console.log('Error', err.message);
        });
    },
    transliterate: function(text) {
        const rus = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я'],
            eng = ['a', 'b', 'v', 'g', 'd', 'e', 'io','zh','z', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'h', 'ts','ch','sh','sch','', 'y', '' , 'e', 'iu','ia'];

        text = text.replace(/[\s,.:;!?"'«»&%$<>]/g,'_').replace(/_+/g,'_');

        for(let i = 0; i < rus.length; i++) {
            text = text.split(rus[i]).join(eng[i]);
            text = text.split(rus[i].toUpperCase()).join(eng[i]);
        }
        return text;
    },
    hasDescription: function (tour) {
        if(tour.mainImg && tour.mainImg!=='assets/img/default-image.png' && tour.details && tour.video){
            return 'success';
        }
        else{
            if(tour.mainImg && tour.mainImg!=='assets/img/default-image.png' || tour.details || tour.video){
                return 'warning';
            }
            else return 'danger';
        }
    }
};