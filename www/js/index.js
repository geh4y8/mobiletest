
Parse.initialize("5qam9A79wM0d2LYD8u1xvWoCKlQNNRvGr84YtVfq", "B4pAPeCT16e8TlIE8fOcvEy5Gke1rwVgm13I8yBk");

var ref = new Firebase('https://hotness.firebaseio.com/');
var pictureSource;
var destinationType;

/// new stuff

var newUser = function(){ref.createUser({
  email    : "guy.halperin887891@gmail.com",
  password : "red"
}, function(error) {
  if (error === null) {
    console.log("User created successfully");
  } else {
    console.log("Error creating user:", error);
  } auth()
});
}

var auth = function(){ ref.authWithPassword({
  email : "guy.halperin887891@gmail.com",
  password : "red"
}, function(err, authData) {
    if (err) {
        switch (err.code) {
            case "INVALID_EMAIL":
                console.log("invalid email")
            case "INVALID_PASSWORD":
                console.log("invalid password")
        }
    } else if (authData) {
        id = authData.uid
        console.log(id)
        console.log("logged in! User ID: " + authData.uid + " Provider: " + authData.provider)
    }
})
}

var authData = ref.getAuth();
var id; 



var logout = function(authData){
    console.log(authData.uid + " is now logged out.")
    ref.unauth();
    if(ref.getAuth() == null) {
    console.log("see....  ")}

};

//////



    // function changeOrientation() {
    //     switch(window.orientation) {
    //         case 90:
    //             myfunc();
    //             break;
    //         default:
    //             console.log('keep turning')
    //             break;

    //     }
    // }

    // window.onorientationchange = function () {
    //     setTimeout(changeOrientation, 800)
    // }

 var TestObject = Parse.Object.extend("TestObject");
 //var testObject = new TestObject();


function myfunc(){
    navigator.geolocation.getCurrentPosition(geoSuccess, onError);
    navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
    destinationType: Camera.DestinationType.DATA_URL
    });
    $("#take_photo").hide()

}
var firebaseRef;

function geoSuccess(position){

    console.log('got here')
    var geolatitude = position.coords.latitude
    var geolongitude = position.coords.longitude
    var accuracy = position.coords.accuracy
    console.log(geolatitude)
    console.log(geolongitude)
    console.log(accuracy)
    firebaseRef = new Firebase("https://hotness.firebaseio.com/")
    console.log("fbrefcreated")
    userPhoto = firebaseRef.child("photos");
    var geoFire = new GeoFire(firebaseRef);
    geoFire.set(authData.uid, [geolatitude, geolongitude]).then(function(){
        
        console.log("provided key has been added to GeoFire");
    }, function(error){
        console.log("error: " + error)
    });

    var geoQuery = geoFire.query({
        center: [45.517459, -122.678216],
        radius: 3
    });
    console.log(geoQuery)
}

function onError(error) {
        console.log('geoerror')
        alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
    }

 var userPhoto;
function onSuccess(data) {
    //console.log(data)
    $("#loading").show()
    var imagedata = data;

    
    userPhoto.child(id).set({
        base64: imagedata
    })

    var parseFile = new Parse.File("mypic.jpg", {base64:imagedata});
   
    parseFile.save().then(function(){
        var testObject = new TestObject();
        testObject.set("picture", parseFile)
        testObject.save();
        var photo = testObject.get("picture");
        console.log(photo.url());
        console.log('saved')
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://rekognition.com/func/api/?api_key=d27krKEkBgGMGkSs&api_secret=pfPCSFmsLPJtpU6t&jobs=face_age/face_beauty/face_beauty/face_sex/face_race/face_emotions&urls=" + photo.url(), false);
        xhr.send();
        response = xhr.responseText
        results = JSON.parse(response)
        // if(results.length == 0){
        //     // FIX ACTION FROM REDIRECT
        //     document.location= "index.html"
        // }
        console.log(results)

        // testObject.set("sex", results.face_detection[0].sex)
        // testObject.set("age", results.face_detection[0].age)
        // testObject.set("beauty", results.face_detection[0].beauty)

        // testObject.save();

        // var userGeoPoint = testObject.get("location");
        // var query = new Parse.Query(TestObject);
        // query.near("location", userGeoPoint);
        // query.limit(10);
        // query.find({
        //     success: function(results){
        //         console.log(results)
        //     }
        // })
        // console.log(query)
        // console.log("status  " + xhr.status)
        // console.log("response  " + xhr.responseText);
        cameraPic.src = 'data:image/png;base64,' + imagedata //photo.url();
        $("#loading").hide()
        $("#cameraPic").show()
        // if(results.face_detection[0].sex == 0){
        //     $(".age-value").html(testObject.get("age") - 5)
        //     $(".value").html(parseInt(testObject.get("beauty")) * 100 + 50)
        // } else if(results.face_detection[0].sex == 1){
        //     $(".value").html(testObject.get("beauty") * 100);
        //     $(".age-value").html(testObject.get("age"));
        // }
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



