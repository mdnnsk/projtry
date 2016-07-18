var myApp = angular.module('myApp', ["ngRoute", "chart.js"]);

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
myApp.controller('controller', ['$scope', '$http', '$window', function( $scope , $http, $window){
  var currentUser;
  //populate username dynamically from db
  $scope.getUserInfo = function (){
    $http.get('/user').then(function(response) {
        currentUser=response.data;
        if(currentUser.username) {
            $scope.userName = currentUser.username;
            $scope.currentLocation = currentUser.homeLoc.city;
            $scope.currentDestination = currentUser.destLoc.city;
            $scope.showDateSelected = (currentUser.trackDate).slice(0,10);
            $scope.notificationPrice = currentUser.notificationPrice;
            console.log('User Data: ', $scope.userName);
          } else {
            $window.location.href = '/index.html';
          }
        });
  };
  $scope.getUserInfo();

//scope the inputs

var userLocations;

$scope.checkInput = function (){
  var homeLocIn = $scope.homeIn;
  var destLocIn = $scope.destIn;
  console.log("before constructing object: " + homeLocIn + " " + destLocIn);
  var checkInputObj = {
    from : homeLocIn,
    to : destLocIn
  };
  console.log(checkInputObj);
  //check db if shortcodes and/or cities matched and bring up modal
  $http({
      method: 'POST',
      url: '/location',
      data: checkInputObj,
      headers: {'Content-Type': 'application/json;charset=utf-8'}
    }).then ( function (response){
      console.log("in post call " , response.data);
      userLocations = response.data;
      $scope.homeLoc = userLocations[0].city;
      $scope.destLoc = userLocations[1].city;

    });


}; //end checkInput


//modal confirmation to update user settings in db
$scope.saveTracking = function(data) {
  var userLocationsObj = {
    user: $scope.userName,
    locations: userLocations
  };
  $http({
    method:'POST',
    url:'/user',
    data:userLocationsObj,
    headers: {'Content-Type': 'application/json;charset=utf-8'}
  }).success(function(){
  console.log(currentUser);
  $scope.getUserInfo();
  $scope.currentLocation = currentUser.homeLoc.city;
  $scope.currentDestination = currentUser.destLoc.city;
});
};


//send API request,
$scope.sendApiRequest = function () {
  if (currentUser.trackDate === null) {
    alert("Please specify date in settings");
  } else {
    apiReqDate = currentUser.trackDate.slice(0,10);
  var apiQuery = {
  "request": {
    "slice": [
      {
        "origin": currentUser.homeLoc.code,
        "destination": currentUser.destLoc.code,
        "date": apiReqDate,
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
    // console.dir("in api call " + response.data.trips.tripOption);
        $http({
        method: 'POST',
        url: '/data',
        data: response.data.trips.tripOption,
        headers: {'Content-Type': 'application/json;charset=utf-8'}
      }).then( function(){
        $scope.displayChart();
      });
    });

}};//end API request function

//hide the graph on start
$scope.tracker = false;

//instert data into chartsJS and display upon request

$scope.displayChart = function (){
$http.get('/data').then(function(response) {
  console.log("in chartsjs get call: ", response);
  //build data arrays for chart
  var dateArray = [];
  for (var i = 0; i < response.data.length; i++) {
    var query_date = (response.data[i].querydate).slice(0,10);
    dateArray.push(query_date);
  }
  var priceArray = [];
  for (var j = 0; j < response.data.length; j++) {
    priceArray.push(response.data[j].price);
  }

  //display data on chart
  $scope.labels = dateArray;
  $scope.series = ['Series A'];
  $scope.data = [priceArray];
  $scope.onChartClick = function (points, evt) {
  console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'

        }
      ]
    }
  };//end chartsJS
});//end function after http
};
$scope.displayChart();

//allow user to select date for which to track flights for
$scope.saveDate = function (){
  var sendDate ={
    user: currentUser.userName ,
    trackDate: $scope.dateSelected
  };
  $http({
    method:'POST',
    url:'/user/updateDate',
    data:sendDate,
    headers: {'Content-Type': 'application/json;charset=utf-8'}
  }).success(function(){
    $scope.getUserInfo();
  });
};// end saveDate function

$scope.saveNotePrice = function (){
  var sendPrice ={
    user: currentUser.userName ,
    price: $scope.priceSelected
  };
  $http({
    method:'POST',
    url:'/user/updatePrice',
    data:sendPrice,
    headers: {'Content-Type': 'application/json;charset=utf-8'}
  }).success(function(){
    $scope.getUserInfo();
  });
};
//send email to user when prices are low (force email only atm)
$scope.sendMail = function (){
  var mailObj = {
    to: "flytrendsz@gmail.com",
    from : "flytrendsz@gmail.com",
    subject: "HEY ITS TIME TO ACT!",
    text: "you should really buy those tickets..."
  };
  console.log(mailObj);
  $http({
    method: 'POST',
    url: '/send',
    date: mailObj,
    headers: {'Content-Type': 'application/json;charset=utf-8'}
  }).success(function(Response) {
console.log(Response);
}).error(function(Response) {
console.log(Response);
});
};

// $scope.sendmail = function () {
// var dataToPost = {to: “ashuanhad@gmail.com”}; /* PostData*/
// $http({
//     url: "/send",
//     method: "GET",
//     params: {to: dataToPost.to}
//  }).success(function(serverResponse) {
// console.log(serverResponse);
// }).error(function(serverResponse) {
// console.log(serverResponse);
// });
// };

}]);
