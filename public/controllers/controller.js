var myApp = angular.module('myApp',['ngRoute', 'infinite-scroll']);


myApp.config(function($routeProvider){
    $routeProvider
        .when( '/productsList', { controller: 'ProductsCtrl', templateUrl: 'products.html' } )
        .when( '/', {controller: 'AccordionCtrl', templateUrl: 'home.html' } )
        .when('/register', { controller: 'RegisterCtrl', templateUrl: 'register.html' })
        .when('/login', { controller: 'LoginCtrl', templateUrl: 'login.html' })
        .when('/addproduct', { controller: 'AddProductCtrl', templateUrl: 'addproduct.html' })
        .when('/comment/:productId?', { controller: 'CommentCtrl', templateUrl: 'comment.html'})
        .when('/product/:productId?', { controller: 'ShowProductCtrl', templateUrl: 'showproduct.html' })
        .when('/mark/:productId?', { controller: 'MarkCtrl', templateUrl: 'mark.html' })
        .otherwise( { redirectTo: '/' } );
});

myApp.controller('AppCtrl',['$scope','$http', function ($scope, $http){
    console.log("Helloo from controller");
}]);



myApp.controller('LoginCtrl',['$scope','$http', function ($scope, $http){
    $scope.onSubmit = function () {
        console.log('onSubmit');
        var postData = angular.toJson($scope.user, true)
        $http.post('/login',postData).then(function(res) {
            if(res.data != 'OK'){
                $scope.errorMessage = res.data;
                console.log('aaa');
            }else {
                console.log("weszlo do else");
                window.location = "#!/productsList";
            }
        }, function (res) {
            console.log('pupa '+res.body);
        });
    }
}]);

myApp.controller('CommentCtrl',['$scope','$http', '$routeParams', function ($scope, $http, $routeParams){
    var id = $routeParams.productId;
    console.log('jestem w comment ctrl '+id);

    $scope.onSubmit = function () {
        var postData = angular.toJson($scope.comment, true)
        $http.post('/comment/'+id, postData).then(function(res) {
            if(res.data != 'OK'){
                $scope.errorMessage = res.data;
                console.log('aaa');
            }else {
                console.log("weszlo do else");
                window.location = "#!/product/"+id;
            }
        }, function (res) {
            console.log('pupa '+res.body);
        });
    }
}]);

myApp.controller('ShowProductCtrl',['$scope','$http', '$routeParams', function ($scope, $http, $routeParams) {
    var id = $routeParams.productId;
    $http.get('/product/'+id).then(function (response) {
        $scope.product = response.data[response.data.length-1];
        $scope.comments = response.data.slice(0, response.data.length-1);
        console.log("w show product "+$scope.product);
    });
}]);

myApp.controller('MarkCtrl',['$scope','$http', '$routeParams', function ($scope, $http, $routeParams){
    var id = $routeParams.productId;
    console.log('jestem w comment ctrl '+id);

    $scope.onSubmit = function () {
        $http.post('/mark/'+id, $scope.marks).then(function(res) {
            if(res.data != 'OK'){
                $scope.errorMessage = res.data;
                console.log('aaa');
            }else {
                console.log("weszlo do else");
                window.location = "#!/product/"+id;
            }
        }, function (res) {
            console.log('pupa '+res.body);
        });
    }
}]);

myApp.controller('ShowProductCtrl',['$scope','$http', '$routeParams', function ($scope, $http, $routeParams) {
    var id = $routeParams.productId;
    $http.get('/product/'+id).then(function (response) {
        $scope.product = response.data[response.data.length-1];
        $scope.comments = response.data.slice(0, response.data.length-1);
        console.log("w show product "+$scope.product);
    });
}]);

myApp.controller('ProductsCtrl',['$scope','$http', '$timeout', function ($scope, $http, $timeout) {
    console.log("jejeje");
    $http.get('/productsList').then(function (response) {
        $scope.productsList = response.data;
        $scope.data = $scope.productsList.slice(0, 3);
        $timeout($scope.getMoreData, 5000);
        $scope.getMoreData = function () {
            $scope.data = $scope.productsList.slice(0, $scope.data.length + 3);
            console.log("Jestem w get more data")
        }
    }, function (res) {
        console.log('pupa');
    });
    $scope.logout = function () {
        window.location = "#!/";
    }
    $scope.addProduct = function () {
        window.location = "#!/addproduct";
    }
}]);

myApp.controller('RegisterCtrl',['$scope','$http', function ($scope, $http) {
    $scope.onSubmit = function () {
        console.log('onSubmit');
        var postData = angular.toJson($scope.user, true)
        $http.post('/register',postData).then(function(res) {
            if(res.data != 'OK'){
                $scope.errorMessage = res.data;
                console.log('aaa');
            }else {
                console.log("weszlo do else");
                window.location = "#!/productsList";
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

myApp.controller('AddProductCtrl',['$scope','$http', function ($scope, $http) {
    $scope.onSubmit = function () {
        console.log('dodajemy produkt');
        var postData = angular.toJson($scope.product, true)
        console.log(postData);
        $http.post('/addproduct',postData).then(function(res) {
            if(res.data != 'OK'){
                $scope.errorMessage = res.data;
                console.log('aaa');
            }else {
                console.log("weszlo do else");
                window.location = "#!/productsList";
            }
        }, function (res) {
            console.log('pupa '+res.body);
        });
    }
}]);