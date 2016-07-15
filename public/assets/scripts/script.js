var myApp = angular.module('myApp', ["ngRoute"]);

myApp.config(["$routeProvider", function ($routeProvider){ // use ngRoute to display 2 views
  $routeProvider.
      when("/home",{
        templateUrl: "/ngroutes/home.html",
        controller:"controller"
      }).
      when("/settings",{
        templateUrl: "/ngroutes/settings.html",
        controller:"controller"
      }).
      otherwise({
        redirectTo: "/home"
      });

}]);//end ngrouter

//create controller for page
myApp.controller('controller', ['$scope', '$http', '$window', function( $scope , $http, $window, ngDialog){
  //populate username dynamically from db
  $http.get('/user').then(function(response) {
      if(response.data.username) {
          $scope.userName = response.data.username;
          console.log('User Data: ', $scope.userName);
      } else {
          $window.location.href = '/index.html';
      }
  });

  //scope the inputs


$scope.checkInput = function (){
  var homeLoc = $scope.homeIn;
  var destLoc = $scope.destIn;
  console.log("before constructing object: " + homeLoc + " " + destLoc);
  var checkInputObj = {
    from : homeLoc,
    to : destLoc
  };
  console.log(checkInputObj);
  //check db if shortcodes and/or cities matched
  $http({
      method: 'POST',
      url: '/location',
      data: checkInputObj,
      headers: {'Content-Type': 'application/json;charset=utf-8'}
    }).then ( function (response){
      console.log("in post call " + response.data.length);

    });
}; //end checkInput


//modal?



//send API request,
$scope.sendApiRequest = function () {

  var apiQuery = {
  "request": {
    "slice": [
      {
        "origin": "MSP", //will populate dynamically from user entry
        "destination": "SFO", //also dynamic
        "date": "2016-07-29", // also
        "maxStops": 0
      }
    ],
    "passengers": {
      "adultCount": 1,
      "infantInLapCount": 0,
      "infantInSeatCount": 0,
      "childCount": 0,
      "seniorCount": 0
    },
    "solutions": 1,
    "refundable": false
  }
  };

  $http({
    method: 'POST',
    url: 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyA_zDR1qkXyrp2P8uspcZ-oJLWbr474pjI',
    data: apiQuery,
    headers: {'Content-Type': 'application/json;charset=utf-8'}
  }).then ( function (response){
    console.dir("in api call " + response.data.trips.tripOption);
        $http({
        method: 'POST',
        url: '/data',
        data: response.data.trips.tripOption,
        headers: {'Content-Type': 'application/json;charset=utf-8'}
        });
    });

};//end API request function

}]);
