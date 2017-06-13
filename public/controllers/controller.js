var myApp = angular.module('myApp',['ngRoute', 'infinite-scroll','ngCookies']);


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

myApp.controller('AppCtrl',['$scope','$http', '$cookieStore', function ($scope, $http,$cookieStore){
    $cookieStore.remove('user');
}]);



myApp.controller('LoginCtrl',['$scope','$http', '$cookieStore', function ($scope, $http,$cookieStore){
    $scope.onSubmit = function () {
        console.log('onSubmit');
        var postData = angular.toJson($scope.user, true)
        $http.post('/login',postData).then(function(res) {
            if(res.data != 'OK'){
                $scope.errorMessage = res.data;
            }else {
                $cookieStore.put('user',$scope.user.login);
                window.location = "#!/productsList";
            }
        });
    }
}]);

myApp.controller('CommentCtrl',['$scope','$http', '$routeParams', '$cookieStore', function ($scope, $http, $routeParams, $cookieStore){
    var autor = $cookieStore.get('user');
    console.log("user"+autor);
    if(autor == undefined)
    {
        window.location = "#!/";
    }
    var id = $routeParams.productId;

    $scope.onSubmit = function () {
        var postData = angular.toJson($scope.comment, true)
        $http.post('/comment/'+id, postData).then(function(res) {
            if(res.data != 'OK'){
                $scope.errorMessage = res.data;
            }else {
                window.location = "#!/product/"+id;
            }
        });
    }
}]);

myApp.controller('ShowProductCtrl',['$scope','$http', '$routeParams', '$cookieStore', function ($scope, $http, $routeParams, $cookieStore) {
    var autor = $cookieStore.get('user');
    console.log("user"+autor);
    if(autor == undefined)
    {
        window.location = "#!/";
    }
    var id = $routeParams.productId;
    $http.get('/product/'+id).then(function (response) {
        $scope.product = response.data[response.data.length-1];
        $scope.comments = response.data.slice(0, response.data.length-1);
    });
}]);

myApp.controller('MarkCtrl',['$scope','$http', '$routeParams', '$cookieStore', function ($scope, $http, $routeParams, $cookieStore){
    var autor = $cookieStore.get('user');
    console.log("user"+autor);
    if(autor == undefined)
    {
        window.location = "#!/";
    }
    var id = $routeParams.productId;

    $scope.onSubmit = function () {
        $http.post('/mark/'+id, $scope.marks).then(function(res) {
            if(res.data != 'OK'){
                $scope.errorMessage = res.data;
            }else {
                window.location = "#!/product/"+id;
            }
        });
    }
}]);

myApp.controller('ShowProductCtrl',['$scope','$http', '$routeParams', '$cookieStore', function ($scope, $http, $routeParams, $cookieStore) {
    var autor = $cookieStore.get('user');
    console.log("user"+autor);
    if(autor == undefined)
    {
        window.location = "#!/";
    }
    var id = $routeParams.productId;
    $http.get('/product/'+id).then(function (response) {
        $scope.product = response.data[response.data.length-1];
        $scope.comments = response.data.slice(0, response.data.length-1);
    });
}]);

myApp.controller('ProductsCtrl',['$scope','$http', '$timeout','$cookieStore', function ($scope, $http, $timeout,$cookieStore) {
    var autor = $cookieStore.get('user');
    console.log("user"+autor);
    if(autor == undefined)
    {
        window.location = "#!/";
    }
    $http.get('/productsList').then(function (response) {
        $scope.productsList = response.data;
        $scope.data = $scope.productsList.slice(0, 3);
        $timeout($scope.getMoreData, 5000);
        $scope.getMoreData = function () {
            $scope.data = $scope.productsList.slice(0, $scope.data.length + 3);
            console.log("Jestem w get more data")
        }
    });
    $scope.logout = function () {
        $cookieStore.remove('user');
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
            }else {
                window.location = "#!/productsList";
            }
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

myApp.controller('AddProductCtrl',['$scope','$http', '$cookieStore', function ($scope, $http, $cookieStore) {
    var autor = $cookieStore.get('user');
    console.log("user"+autor);
    if(autor == undefined)
    {
        window.location = "#!/";
    }
    $scope.onSubmit = function () {
        var postData = angular.toJson($scope.product, true)
        console.log(postData);
        $http.post('/addproduct',postData).then(function(res) {
            if(res.data != 'OK'){
                $scope.errorMessage = res.data;
            }else {
                window.location = "#!/productsList";
            }
        });
    }
}]);