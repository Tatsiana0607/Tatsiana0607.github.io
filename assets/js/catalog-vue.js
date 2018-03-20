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
                // let start = $('#date-start').val();
                // let end = $('#date-end').val();

                // console.log(start+" | "+end);

                if(!date.start && !date.end) return true;
                // if(!start && !end) return true;
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
            console.log(filtered);
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
            monthNames: [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ],
            dayNamesMin: [ "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" ],
            firstDay: 1,
            onSelect: function (date) {
                vm.dateValues.start = date;
            }
        });
        $('#date-end').datepicker({
            monthNames: [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ],
            dayNamesMin: [ "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" ],
            firstDay: 1,
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