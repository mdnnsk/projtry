var myApp = angular.module('myApp', ["ngRoute"]);

myApp.config(["$routeProvider", function ($routeProvider){ // use ngRoute to display 2 views
  $routeProvider.
      when("/home",{
        templateUrl: "/ngroutes/home.html",
        controller:"UserController"
      }).
      when("/settings",{
        templateUrl: "/ngroutes/settings.html",
        controller:"UserController"
      });
      // otherwise({
      //   redirectTo: "/login"
      // });

}]);//end ngrouter

//create controller for page
myApp.controller('controller', ['$scope', '$http', function( $scope , $http ){

}]); //end controller

myApp.controller('UserController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    $scope.userName;

    // This happens after page load, which means it has authenticated if it was ever going to
    // NOT SECURE
    $http.get('/user').then(function(response) {
        if(response.data.username) {
            $scope.userName = response.data.username;
            console.log('User Data: ', $scope.userName);
        } else {
            $window.location.href = '/index.html';
        }
    });
}]);