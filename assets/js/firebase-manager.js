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
        countries: [
            {id: 'norway', value: 'Норвегия'},
            {id: 'finland', value: 'Финляндия'},
            {id: 'russia', value: 'Россия'},
            {id: 'usa', value: 'США'},
            {id: 'canada', value: 'Канада'},
            {id: 'iceland', value: 'Исландия'},
            {id: 'sweden', value: 'Швеция'},
            {id: 'denmark', value: 'Дания'}],
        options:[
            {value: '', text: 'Сортировка'},
            {value: 'price', text: 'по цене'},
            {value: 'days', text: 'по длительности'}
        ],
        tours: [],
        search: '',
        dateValues: {start:'', end:''},
        priceValues: {min: 0, max: 0},
        durationValues:{min: 0, max: 0},
        sorting: '',
        checkedCountries: [],
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
    },
    computed:{
        filteredTours: function(){
            let countries = this.checkedCountries;
            let price = this.priceValues;
            let days = this.durationValues;
            let date = this.dateValues;
            let criteria = this.sorting;

            let filtered = this.tours.filter(function (elem) {
                if(countries.length){
                    return countries.some(item => {return item===elem.country;});
                }
                return true;
            }).filter(function (elem) {
                return elem.price >= price.min && elem.price <= price.max;
            }).filter(function (elem) {
                return elem.days >= days.min && elem.days <= days.max;
            }).filter(function (elem) {
                if(!date.start && !date.end) return true;
                else if(date.start && !date.end) return moment(elem.date) >= moment(date.start);
                else if(!date.start && date.end) return moment(elem.date) <= moment(date.end);
                return moment(elem.date) >= moment(date.start) && moment(elem.date) <= moment(date.end);
            });

            if(criteria){
                filtered.sort(function (a, b) {
                    if (a[criteria] > b[criteria]) {return 1;}
                    if (a[criteria] < b[criteria]) {return -1;}
                    return 0;
                });
            }
            return filtered;
        },
    },
    filters: {
        formatDate(date){
            let options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            };
            moment.locale('ru');
            return moment(date).format('LL');
        }
    },
    created: function () {
        this.getToursData();
    },
    mounted: function () {
        let vm = this;
        $('#date-start').datepicker({
            onSelect: function(date) {
                vm.dateValues.start = date;
            }
        });
        $('#date-end').datepicker({
            onSelect: function(date) {
                vm.dateValues.end = date;
            }
        })
    }
});


//компоненты jQuery UI
$('#price-slider').slider( { min: 100, max: 2000, step:10, animate: 500, range: true, values:[100,2000],slide: printValues, change: printValues } );
$('#duration-slider').slider( { min: 1, max: 30, step:1, animate: 500, range: true, values:[1,30],slide: printValues, change: printValues } );

function printValues() {
    let minPrice = $('#price-slider').slider('values',0);
    let maxPrice = $('#price-slider').slider('values',1);
    vueApp.priceValues.min = minPrice;
    vueApp.priceValues.max = maxPrice;
    let maxDuration = $('#duration-slider').slider('values',0);
    let minDuration = $('#duration-slider').slider('values',1);
    vueApp.durationValues.min = maxDuration;
    vueApp.durationValues.max = minDuration;
}
printValues();

$('#country').controlgroup();
$('#pagination').controlgroup();
$('#sort').selectmenu({change:changed});

function changed(event,ui) {
    vueApp.sorting = ui.item.value;
}