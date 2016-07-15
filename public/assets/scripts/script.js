var myApp = angular.module('myApp', ["ngRoute", "ngDialog"]);

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

$scope.clickToOpen = function () {
ngDialog.open({ template: 'popupTmpl.html' });
};

$scope.sendApiRequest = function () {

  var apiQuery = {
  "request": {
    "slice": [
      {
        "origin": "MSP",
        "destination": "SFO",
        "date": "2016-07-28",
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
    console.log("in api call " + response.data);

  });

};//end API request function
  //if dont match - tell user in modal and ask them to try again

  //if entries match confirm them with user

  // append tracking entries to dom - triggered by confirmation on modal

  // var setTrack = function(homeLoc,destLoc) {
  //
  // };

// //toggle modal and check inputs
//   $scope.modalShown = false;
//   $scope.toggleModal = function() {
//     $scope.modalShown = !$scope.modalShown;
//     $scope.checkInput();
//   }; //end toggle modal
//
// }]); //end controller
//
// myApp.directive('modalDialog', function() {
//   return {
//     restrict: 'E',
//     scope: {
//       show: '='
//     },
//     replace: true,
//     transclude: true,
//     link: function(scope, element, attrs) {
//       scope.dialogStyle = {};
//       if (attrs.width)
//         scope.dialogStyle.width = attrs.width;
//       if (attrs.height)
//         scope.dialogStyle.height = attrs.height;
//       scope.hideModal = function() {
//         scope.show = false;
//       };
//     },
//     template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
  }]);
// });
