// объект Vue для личного кабинета
let vueUser = new Vue({
    el: '#profile',
    data: {
        requests: []
    },
    methods: {
        transliterate: storage.transliterate,
        cancelRequest: function (name) {
            let email = vueMain.currentUser.email.replace(".","");
            let uid = this.transliterate(name);
            console.log(uid);
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
    }
});