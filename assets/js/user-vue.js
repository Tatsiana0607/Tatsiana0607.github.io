// объект Vue для личного кабинета
let vueUser = new Vue({
    el: '#profile',
    data: {
        requests: [],
        passwordNew: '',
        // profileImg: {}
    },
    methods: {
        transliterate: storage.transliterate,
        cancelRequest: function (name) {
            let email = this.currentUser.email.replace(".","");
            let uid = this.transliterate(name);
            $.ajax({
                url:URL_USERS_DATA+"/"+email+"/requests/"+uid+".json",
                type:'DELETE',
                dataType:'json'
            }).then(() => {
                console.log('Заявка отменена.');
                vueMain.getUserData(email);
            }).catch((err) => {
                console.log('Error', err.message);
            });
        }
    },
    mounted: function () {
        let vm = this;
        $('#birthday').datepicker({
            changeYear: true,
            yearRange: "1940:2018",
            changeMonth: true,
            monthNamesShort: [ "Янв", "Фев", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сен", "Окт", "Ноя", "Дек" ],
            dayNamesMin: [ "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" ],
            firstDay: 1,
            onSelect: function (date) {
                vm.currentUser.birthday = date;
            }
        });
    }
});