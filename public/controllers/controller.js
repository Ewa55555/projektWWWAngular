var myApp = angular.module('myApp',['ngRoute']);

myApp.config(function($routeProvider){
    $routeProvider
        .when( '/productsList', { controller: 'ProductCtrl', templateUrl: 'products.html' } )
        .when( '/', {controller: 'AccordionCtrl', templateUrl: 'home.html' } )
        .when('/register', { controller: 'RegisterCtrl', templateUrl: 'register.html' })
        .otherwise( { redirectTo: '/' } );
});

myApp.controller('AppCtrl',['$scope','$http', function ($scope, $http){
    console.log("Helloo from controller");
}]);

myApp.controller('ProductsCtrl',['$scope','$http', function ($scope, $http) {
    console.log("jejeje");
    $http.get('/productsList').then(function (response) {
        $scope.productsList = response.data;
    }, function (res) {
        console.log('pupa');
    });
    $scope.logout = function () {
        console.log("kliklam logout");
    }
}]);

myApp.controller('RegisterCtrl',['$scope','$http', function ($scope, $http) {
    $scope.onSubmit = function () {
        var postData = angular.toJson($scope.user, true)
        $http.post('/register',postData).then(function(res) {
            if(res.data){
                $scope.errorMessage = res.data;
            }else {
                console.log('dodalo sie');
            }
        }, function (res) {
            console.log('pupa '+res.body);
        });
    }
}]);

myApp.controller('AccordionCtrl',['$scope','$http', function ($scope, $http){
    var acc = document.getElementsByClassName("accordion");
    acc[0].onclick = function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight){
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    }
}]);