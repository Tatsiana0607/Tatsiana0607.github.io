// объект Vue для админки
let vueAdmin = new Vue({
    el: '#admin',
    data: {
        countries: storage.countries,
        tours: storage.tours,
        fullness:[
            {value: 'danger', text: 'без описания'},
            {value: 'warning', text: 'частичное описание'},
            {value: 'success', text: 'полное описание'}
        ],
        currentTour: {},
        catalogImg: {},
        checkedFullness: []
    },
    methods: {
        getToursData: storage.getToursData,
        hasDescription: storage.hasDescription,
        transliterate: storage.transliterate,
        getCountryById: function (id) {
            return this.countries.filter(function (item) {
                return item.id===id;
            })[0].value;
        },
        getTourInfo: function (uid) {
            $('.catalog-file-info').html('');
            $('.main-file-info').html('');
            this.catalogImg={};
            $.ajax({
                url:URL_TOURS_DATA+"/"+uid+".json",
                type:'GET',
                dataType:'json'
            }).then((result) => {
                this.currentTour = result;
                $('#destinationNew').val(this.currentTour.country).selectmenu("refresh");
                this.currentTour.description=this.currentTour.description.join("\n");
            }).catch((err) => {
                console.log('Error', err.message);
            });
        },
        addOrEditTourCard: function () {
            let newTourCard = this.currentTour;
            if(!this.currentTour.creationDate){
                newTourCard.creationDate = (new Date).getTime();
            }
            newTourCard.days = parseInt(this.currentTour.duration);
            newTourCard.description = this.currentTour.description.split("\n");
            newTourCard.uid = this.transliterate(this.currentTour.name);

            let ref = TOURS_FILES_REF.child(newTourCard.uid+'/catalogImg.jpg');
            if(Object.keys(this.catalogImg).length !== 0){
                ref.put(this.catalogImg).then(function(snapshot) {
                    newTourCard.catalogImg = snapshot.downloadURL;
                    sendRequest();
                });
            }
            else sendRequest();

            function sendRequest() {
                $.ajax({
                    url:URL_TOURS_DATA+"/"+newTourCard.uid+".json",
                    type:'PUT',
                    data: JSON.stringify(newTourCard),
                    contentType: "application/json; charset=utf-8",
                    dataType:'json'
                }).then((result) => {
                    console.log('Добавлен тур', result);
                    vueAdmin.getToursData();
                    vueAdmin.clearInfo();
                }).catch((err) => {
                    console.log('Error', err.message);
                });
            }
        },
        deleteTour: function (tour) {
            $.ajax({
                url:URL_TOURS_DATA+"/"+tour.uid+".json",
                type:'DELETE',
                dataType:'json'
            }).then(() => {
                console.log('Тур удален.');
                this.getToursData();

                function deleteImageIfExists(refPass, imgPass) {
                    if(refPass && refPass!=='assets/img/default-image.png') {
                        TOURS_FILES_REF.child(tour.uid+"/"+imgPass+".jpg").delete().then(function() {
                            console.log('Файл удален');}).catch(function(error) {console.log('Error', error.message);});
                    }
                }
                deleteImageIfExists(tour.catalogImg, 'catalogImg');
                deleteImageIfExists(tour.mainImg, 'mainImg');
                deleteImageIfExists(tour.trips[0].img, 'trip1');
                deleteImageIfExists(tour.trips[1].img, 'trip2');
                deleteImageIfExists(tour.trips[2].img, 'trip3');

            }).catch((err) => {
                console.log('Error', err.message);
            });
        },
        uploadFile: function (id) {
            $(".overlay").css('opacity', '1');
            let tour=this.currentTour;

            if(id==='catalogImg' || id==='catalogImgNew'){
                let ref = TEMP_FILES_REF.child('catalogImg.jpg');
                this.catalogImg = $('#'+id)[0].files[0];
                $('.catalog-file-info').html(this.catalogImg.name);
                ref.put(this.catalogImg).then(function(snapshot) {
                    tour.catalogImg = snapshot.downloadURL;
                });
            }
        },
        clearInfo: function () {
            $('#destination').val("norway").selectmenu("refresh");
            $('.catalog-file-info').html('');
            this.catalogImg={};
            this.currentTour = {
                catalogImg: 'assets/img/default-image.png',
                country: "norway",
            };
        },
        // clearImgInfo: function () {
        //     this.currentTour.mainImg = 'assets/img/default-image.png';
        //     this.currentTour.trip1 = 'assets/img/default-image.png';
        //     this.currentTour.trip2 = 'assets/img/default-image.png';
        //     this.currentTour.trip3 = 'assets/img/default-image.png';
        // },
        switchModal: function (enable, disable) {
            $(enable).removeClass('hide');
            $(disable[0]).addClass('hide');
            $(disable[1]).addClass('hide');
        },
        removeOverlay: function () {
            $('.overlay').css('opacity', '0');
        }
    },
    computed:{
        filteredTours: function(){
            let fullness = this.checkedFullness;
            let desc = this.hasDescription;
            return this.tours.filter(function (elem) {
                if(fullness.length){
                    return fullness.some(item => {return item===desc(elem);});
                }
                return true;
            });
        },
    },
    created: function () {
        this.getToursData();
    },
    mounted: function () {
        let vm = this;
        $('#date').datepicker({
            onSelect: function (date) {
                vm.currentTour.date = date;
            }
        });
        $('#dateNew').datepicker({
            onSelect: function (date) {
                vm.currentTour.date = date;
            }
        });
    }
});

$('#fullness').controlgroup();

$('#destination').selectmenu({change:changeDestination});
$('#destinationNew').selectmenu({change:changeDestination});

$('#service-icon1').selectmenu({change:changeIcon1});
$('#service-icon1New').selectmenu({change:changeIcon1});
$('#service-icon2').selectmenu({change:changeIcon2});
$('#service-icon2New').selectmenu({change:changeIcon2});
$('#service-icon3').selectmenu({change:changeIcon3});
$('#service-icon3New').selectmenu({change:changeIcon3});
$('#service-icon4').selectmenu({change:changeIcon4});
$('#service-icon4New').selectmenu({change:changeIcon4});
$('#service-icon5').selectmenu({change:changeIcon5});
$('#service-icon5New').selectmenu({change:changeIcon5});
$('#service-icon6').selectmenu({change:changeIcon6});
$('#service-icon6New').selectmenu({change:changeIcon6});

function changeDestination(event,ui) {
    vueAdmin.currentTour.country = ui.item.value;
}

function changeIcon1(event, ui) {vueAdmin.icons[1] = ui.item.value;}
function changeIcon2(event, ui) {vueAdmin.icons[2] = ui.item.value;}
function changeIcon3(event, ui) {vueAdmin.icons[3] = ui.item.value;}
function changeIcon4(event, ui) {vueAdmin.icons[4] = ui.item.value;}
function changeIcon5(event, ui) {vueAdmin.icons[5] = ui.item.value;}
function changeIcon6(event, ui) {vueAdmin.icons[6] = ui.item.value;}