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
let URL_TOUR_DATA ="https://polar-star.firebaseio.com/tours.json?orderBy=\"uid\"&equalTo=";

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
            url:URL_TOURS_DATA, type:'GET', dataType:'json'
        }).then((result) => {
            this.tours = result;
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
        return !!(tour.mainImg && tour.details && tour.video && tour.services && tour.trips);
    }
};


// объект Vue для каталога
let vueCatalog = new Vue({
    el: '#catalog',
    data: {
        countries: storage.countries,
        options:[
            {value: '', text: 'Сортировка'},
            {value: 'price', text: 'по цене'},
            {value: 'days', text: 'по длительности'}
        ],
        pagination:[
            {value: 3, text: 'по 3'},
            {value: 6, text: 'по 6'},
            {value: 9, text: 'по 9'}
        ],
        selected:'',
        tours: storage.tours,
        search: '',
        dateValues: {start:'', end:''},
        priceValues: {min: 0, max: 0},
        durationValues:{min: 0, max: 0},
        sorting: '',
        checkedCountries: [],
        totalTours: 0,
        toursPerPage: 3,
        numberOfPages: 0,
        currentPage: 1
    },
    methods: {
        getToursData: storage.getToursData,
        transliterate: storage.transliterate,
        hasDescription: storage.hasDescription,
        goToPage: function (page) {
            this.currentPage=page;
        },
        goToTourPage: function (tour) {
            vueTour.tour = tour;
            window.open("tour.html","_self");
        }
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
            this.totalTours = filtered.length;
            this.numberOfPages = Math.ceil(filtered.length/this.toursPerPage);
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
            onSelect: function (date) {
                vm.dateValues.start = date;
            }
        });
        $('#date-end').datepicker({
            onSelect: function (date) {
                vm.dateValues.end = date;
            }
        });
    }
});


//компоненты jQuery UI в каталоге
$('#price-slider').slider( { min: 100, max: 2000, step:10, animate: 500, range: true, values:[100,2000],slide: printValues, change: printValues } );
$('#duration-slider').slider( { min: 1, max: 30, step:1, animate: 500, range: true, values:[1,30],slide: printValues, change: printValues } );

function printValues() {
    let minPrice = $('#price-slider').slider('values',0);
    let maxPrice = $('#price-slider').slider('values',1);
    vueCatalog.priceValues.min = minPrice;
    vueCatalog.priceValues.max = maxPrice;
    let maxDuration = $('#duration-slider').slider('values',0);
    let minDuration = $('#duration-slider').slider('values',1);
    vueCatalog.durationValues.min = maxDuration;
    vueCatalog.durationValues.max = minDuration;
}
printValues();

$('#country').controlgroup();
$('#pagination').controlgroup();
$('#sort').selectmenu({change:changeSelect});

function changeSelect(event,ui) {
    vueCatalog.sorting = ui.item.value;
}


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
            let name = location.search.replace("?name=","");
            $.ajax({
                url:URL_TOUR_DATA+"\""+name+"\"", type:'GET', dataType:'json'
            }).then((result) => {
                this.tour = Object.values(result)[0];
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


// объект Vue для админки
let vueAdmin = new Vue({
    el: '#admin',
    data: {
        countries: storage.countries,
        tours: storage.tours,
        editTourCard: {}
    },
    methods: {
        getToursData: storage.getToursData,
        hasDescription: storage.hasDescription,
        getCountryById: function (id) {
            return this.countries.filter(function (item) {
                return item.id===id;
            })[0].value;
        },
        getTourByNumber: function (num) {
            this.editTourCard=this.tours[num];
            $('#destinationNew').val(this.editTourCard.country).selectmenu("refresh");
            console.log(this.editTourCard.description);
            this.editTourCard.description=this.editTourCard.description.join("\n");
        },
        switchModal: function (enable, disable) {
            $(enable).removeClass('hide');
            $(disable[0]).addClass('hide');
            $(disable[1]).addClass('hide');
        }
    },
    created: function () {
        this.getToursData();
    },
    mounted: function () {
        let vm = this;
        $('#dateNew').datepicker({
            onSelect: function (date) {
                vm.editTourCard.date = date;
            }
        });
        $('#date').datepicker({
            // onSelect: function (date) {
            //     vm.dateValues.end = date;
            // }
        });
    }
});

// $('#destination').selectmenu(
//     // {change:changeDestination}
//     );
$('#destinationNew').selectmenu({change:changeDestinationNew});

function changeDestinationNew(event,ui) {
    vueAdmin.editTourCard.country = ui.item.value;
}