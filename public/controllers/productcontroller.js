var myApp = angular.module('myApp',[]);
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