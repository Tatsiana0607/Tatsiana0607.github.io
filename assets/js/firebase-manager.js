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
const URL_USERS_DATA ="https://polar-star.firebaseio.com/users";
const TEMP_FILES_REF = firebase.storage().ref('temp');
const TOURS_FILES_REF = firebase.storage().ref('tours/');
const USERS_FILES_REF = firebase.storage().ref('users');
const DEFAULT_PROFILE_IMG = 'https://firebasestorage.googleapis.com/v0/b/polar-star.appspot.com/o/users%2Fdefault-avatar.png?alt=media&token=e99e5596-578a-4c28-a934-e576a1e1d016';

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

//объект Vue для регистрации и авторизации
let vueMain = new Vue({
    el: '#user',
    data: {
        styleObject: {
            backgroundImage: '',
            backgroundPosition: 'center center',
            backgroundSize: 'cover'
        },
        newUser: {
            email: '',
            password: ''
        },
        passwordCheck:'',
        users: [],
        currentUser: {},
    },
    methods: {
        register: function () {
            let client = this.newUser;
            let uid = client.email.replace('.', '');
            $.ajax({
                url: URL_USERS_DATA + "/" + uid + '.json',
                type: 'GET',
                dataType: 'json'
            }).then((result) => {
                if (result) {
                    $('#email').css('border', '2px solid red');
                    console.log("Пользователь с таким email-ом уже существует!");
                }
                else {
                    client.password = sha1(this.newUser.password);
                    client.status = 'client';
                    client.profileImg = DEFAULT_PROFILE_IMG;
                    $("#modalRegister").modal("hide");
                    $.ajax({
                        url: URL_USERS_DATA + "/" + uid + ".json",
                        type: 'PUT',
                        data: JSON.stringify(client),
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json'
                    }).then((result) => {
                        console.log('Клиент зарегистрирован', result);
                        this.newUser={};
                        this.passwordCheck='';
                    }).catch((err) => {
                        console.log('Error', err.message);
                    });
                }
            }).catch((err) => {
                console.log('Error', err.message);
            });
        },
        login: function () {
            let email = this.currentUser.email.replace('.','');
            $.ajax({
                url:URL_USERS_DATA+"/"+email+'.json',
                type:'GET',
                dataType:'json'
            }).then((result) => {
                if(!result || sha1(this.currentUser.password)!==result.password){
                    $('#error').css('display','block');
                    console.log("Неверный e-mail или пароль!");
                }
                else{
                    this.currentUser = result;
                    if(result.profileImg){
                        this.styleObject.backgroundImage = 'url('+result.profileImg+')';
                    }
                    document.cookie = "email="+email+"; max-age="+1800;
                }
            }).catch((err) => {
                console.log('Error', err.message);
            });
        },
        logout: function () {
            this.currentUser = {status: 'guest'};
            document.cookie = 'email=""; max-age=0';
            if(window.location.href!=='https://tatsiana0607.github.io/index.html'){
                window.location.href='index.html';
            }
        },
        getUserData: function (email) {
            $.ajax({
                url:URL_USERS_DATA+"/"+email+'.json',
                type:'GET',
                dataType:'json'
            }).then((result) => {
                this.currentUser = result;
                if(result.profileImg){
                    this.styleObject.backgroundImage = 'url('+result.profileImg+')';
                }
                if(this.currentUser.requests){
                    vueUser.requests = Object.values(this.currentUser.requests);
                }
                else vueUser.requests={};
            }).catch((err) => {
                console.log('Error', err.message);
            });
        },
    },
    created: function () {
        try{
            let cookie = document.cookie.match(/email=(.*)/)[1];
            document.cookie = "email="+cookie+"; max-age="+1800;
            this.getUserData(cookie);
        }
        catch(err) {
            console.log('Пользователь не авторизован.');
            this.currentUser={status: 'guest'}
        }
    }
});