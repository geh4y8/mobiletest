/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Parse.initialize("5qam9A79wM0d2LYD8u1xvWoCKlQNNRvGr84YtVfq", "B4pAPeCT16e8TlIE8fOcvEy5Gke1rwVgm13I8yBk");

var pictureSource;
var destinationType;

function myfunc(){
    navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
    destinationType: Camera.DestinationType.DATA_URL
    });
    console.log('success')
}

function onSuccess(data) {
    //console.log(data)

    var imagedata = data;
    var TestObject = Parse.Object.extend("TestObject");

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
        testObject.set("age", results.face_detection[0].age)
        testObject.set("beauty", results.face_detection[0].beauty * 100)
        testObject.save();
        console.log(testObject.get("age"))
        console.log(testObject.get("beauty"))
        console.log("status  " + xhr.status)
        console.log("response  " + xhr.responseText);
        cameraPic.src = photo.url();
        $("#cameraPic").show()
        $("#take_photo").hide()
        $(".value").html(testObject.get("beauty"))
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

var Photos = Backbone.Collection.extend({
    url: '/photos'
});

var Photo = Backbone.Model.extend({
    urlRoot: '/photos'
});

var PhotoList = Backbone.View.extend({
    el: '.deviceready',
    render: function() {
        var that = this;
        var photos = new Photos();
        photos.fetch({
            success: function(photos) {
                var template = _.template($('#photo-list-template').html(), {photos: photos.models})
                that.$el.html(template);
            }
        })
    }

})

var photoList = new PhotoList();
var Router = Backbone.Router.extend({
    routes: {
      '': 'home'
    }
  });

var router = new Router();
router.on('route:home', function () {
    photoList.render();
});



