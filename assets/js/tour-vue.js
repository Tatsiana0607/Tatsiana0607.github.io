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
            let key = location.search.replace("?name=","");
            $.ajax({
                url:URL_TOURS_DATA+"/"+key+".json",
                type:'GET',
                dataType:'json'
            }).then((result) => {
                this.tour = result;
                this.styleObject.backgroundImage = 'url('+this.tour.mainImg+')';
            }).catch((err) => {
                console.log('Error', err.message);
            });
        },
        addTourRequest: function () {
            let client = vueUser.currentUser;
            let uid = client.email.replace('.', '');

            if(client.requests){
                if(client.requests[this.tour.uid]){
                    $("#modalRequestDenied").modal("show");
                }
                else sendRequest();
            }
            else sendRequest();

            function sendRequest() {
                $("#modalRequestAccepted").modal("show");
                let request = {
                    [vueTour.tour.uid]: {
                        name: vueTour.tour.name,
                        status: 'processing'
                    }
                };
                $.ajax({
                    url: URL_USERS_DATA + "/" + uid + "/requests.json",
                    type: 'PATCH',
                    data: JSON.stringify(request),
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json'
                }).then((result) => {
                    console.log('Заявка подана', result);
                    vueUser.getUserData(uid);
                }).catch((err) => {
                    console.log('Error', err.message);
                });
            }
        }
    },
    created: function () {
        this.getTourData();
    }
});