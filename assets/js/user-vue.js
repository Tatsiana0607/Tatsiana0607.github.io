// объект Vue для личного кабинета
let vueUser = new Vue({
    el: '#profile',
    data: {
        requests: [],
        passwordNew: '',
        profileImg: {}
    },
    methods: {
        transliterate: storage.transliterate,
        uploadFile: function (id) {
            $(".overlay").css('opacity', '1');
            let user=vueMain.currentUser;

            let ref = TEMP_FILES_REF.child(user.email.replace(".","")+'.jpg');
            this.profileImg = $('#' + id)[0].files[0];
            $('.profile-file-info').html(this.profileImg.name);
            ref.put(this.profileImg).then(function (snapshot) {
                user.profileImg = snapshot.downloadURL;
            });
        },
        editProfile: function () {
            let user = vueMain.currentUser;
            let email = vueMain.currentUser.email.replace(".","");

            let ref = USERS_FILES_REF.child(email+'.jpg');
            if(this.profileImg.size){
                ref.put(this.profileImg).then(function(snapshot) {
                    user.profileImg = snapshot.downloadURL;
                    sendRequest();
                });
            }
            else sendRequest();

            function sendRequest() {
                $.ajax({
                    url:URL_USERS_DATA+"/"+email+".json",
                    type:'PUT',
                    data: JSON.stringify(user),
                    contentType: "application/json; charset=utf-8",
                    dataType:'json'
                }).then((result) => {
                    console.log('Профиль изменен', result);
                    vueMain.getUserData(email);
                    vueUser.profileImg={};
                }).catch((err) => {
                    console.log('Error', err.message);
                });
            }
        },
        editPassword: function () {
            let email = vueMain.currentUser.email.replace(".", "");
            let password = {password: sha1(this.passwordNew)};
            $.ajax({
                url: URL_USERS_DATA + "/" + email + ".json",
                type: 'PATCH',
                data: JSON.stringify(password),
                contentType: "application/json; charset=utf-8",
                dataType: 'json'
            }).then((result) => {
                console.log('Пароль изменен', result);
                vueMain.getUserData(email);
            }).catch((err) => {
                console.log('Error', err.message);
            });
        },
        deleteUser: function (tour) {
            let email = vueMain.currentUser.email.replace(".","");
            $.ajax({
                url:URL_USERS_DATA+"/"+email+".json",
                type:'DELETE',
                dataType: 'json'
            }).then(() => {
                console.log('Пользователь удален.');
                USERS_FILES_REF.child(email + ".jpg").delete()
                .then(function () {
                    console.log('Файл удален');
                })
                .catch(function (error) {
                    console.log('Error', error.message);
                });
                vueMain.logout();
            }).catch((err) => {
                console.log('Error', err.message);
            });
        },
        cancelRequest: function (name) {
            let email = vueMain.currentUser.email.replace(".","");
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
        $('#birthday').datepicker({
            changeYear: true,
            yearRange: "1940:2018",
            changeMonth: true,
            monthNamesShort: [ "Янв", "Фев", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сен", "Окт", "Ноя", "Дек" ],
            dayNamesMin: [ "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" ],
            firstDay: 1,
            onSelect: function (date) {
                vueMain.currentUser.birthday = date;
            }
        });
    }
});