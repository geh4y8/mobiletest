
Parse.initialize("5qam9A79wM0d2LYD8u1xvWoCKlQNNRvGr84YtVfq", "B4pAPeCT16e8TlIE8fOcvEy5Gke1rwVgm13I8yBk");


var pictureSource;
var destinationType;

function changeOrientation() {
    switch(window.orientation) {
        case 90:
            myfunc();
            break;
        default:
            console.log('keep turning')
            break;

    }
}

window.onorientationchange = function () {
    setTimeout(changeOrientation, 800)
}

var TestObject = Parse.Object.extend("TestObject");
var testObject = new TestObject();
function myfunc(){
    navigator.geolocation.getCurrentPosition(geoSuccess, onError);
    navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
    destinationType: Camera.DestinationType.DATA_URL
    });
    $("#take_photo").hide()

}

function geoSuccess(position){
    var geolatitude = position.coords.latitude
    var geolongitude = position.coords.longitude
    var accuracy = position.coords.accuracy
    var point = new Parse.GeoPoint({latitude: geolatitude, longitude: geolongitude});
    testObject.set("location", point);
    testObject.save();
    console.log(testObject.get("location"))
    console.log(geolatitude)
    // console.log(testObject.get("longitude"))
    // console.log("accuracy: " + accuracy)
}

function onError(error) {
        console.log('geoerror')
        alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
    }

function onSuccess(data) {
    //console.log(data)
    $("#loading").show()
    var imagedata = data;


    var parseFile = new Parse.File("mypic.jpg", {base64:imagedata});

    parseFile.save().then(function(){
        //var testObject = new TestObject();
        testObject.set("picture", parseFile)
        testObject.save();
        var photo = testObject.get("picture");
        // console.log(photo.url());
        // console.log('saved')
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://rekognition.com/func/api/?api_key=d27krKEkBgGMGkSs&api_secret=pfPCSFmsLPJtpU6t&jobs=face_age/face_beauty/face_beauty/face_sex/face_race/face_emotions&urls=" + photo.url(), false);
        xhr.send();
        response = xhr.responseText
        results = JSON.parse(response)
        console.log(results)
        testObject.set("sex", results.face_detection[0].sex)
        testObject.set("age", results.face_detection[0].age)
        testObject.set("beauty", results.face_detection[0].beauty)

        testObject.save();
        var userGeoPoint = testObject.get("location");
        var query = new Parse.Query(TestObject);
        query.near("location", userGeoPoint);
        query.limit(10);
        query.find({
            success: function(results){
                console.log(results)
            }
        })
        console.log(query)
        // console.log("status  " + xhr.status)
        // console.log("response  " + xhr.responseText);
        cameraPic.src = photo.url();
        $("#loading").hide()
        $("#cameraPic").show()
        if(results.face_detection[0].sex == 0){
            $(".age-value").html(testObject.get("age") - 5)
            $(".value").html(parseInt(testObject.get("beauty")) * 100 + 50)
        } else if(results.face_detection[0].sex == 1){
            $(".value").html(testObject.get("beauty") * 100);
            $(".age-value").html(testObject.get("age"));
        }
        $("#results_chart").show();

    })
}

function onFail(message) {
    console.log('failed')
    alert('Failed because: ' + message);
    document.location= "index.html"
}


var app = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

// var Photos = Backbone.Collection.extend({
//     url: '/photos'
// });

// var Photo = Backbone.Model.extend({
//     urlRoot: '/photos'
// });

// var PhotoList = Backbone.View.extend({
//     el: '.deviceready',
//     render: function() {
//         var that = this;
//         var photos = new Photos();
//         photos.fetch({
//             success: function(photos) {
//                 var template = _.template($('#photo-list-template').html(), {photos: photos.models})
//                 that.$el.html(template);
//             }
//         })
//     }

// })

// var photoList = new PhotoList();
// var Router = Backbone.Router.extend({
//     routes: {
//       '': 'home'
//     }
//   });

// var router = new Router();
// router.on('route:home', function () {
//     photoList.render();
// });



