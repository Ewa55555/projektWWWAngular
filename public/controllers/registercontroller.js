var myApp = angular.module('myApp',[]);
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