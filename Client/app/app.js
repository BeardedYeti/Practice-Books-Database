//Initializes module
var app = angular.module('bookapp', ['ui.router', 'angular-loading-bar', 'angularUtils.directives.dirPagination']);

//Routes via UI-Router
app.config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
      .state('home', {
        url: "/home",
        templateUrl: "templates/home.html"
      })
      .state('Newbook', {
        url: "/addnew",
        templateUrl: "templates/newbook.html"
      })
      .state('Editbook', {
        url: "/editbook",
        templateUrl: "templates/editbook.html"
      })
    }
  }]);

//Controller for home.html
app.controller('book-list', function($scope, $state, $http, sharedbook, $filter){
  $scope.booklist = {};
  $scope.pageSize = 5;
  $scope.currentPage = 1;
  $http.get("http://localhost:8080/book").success(function(response){
    if(response.error === 0){
      $scope.booklist = response.Books;
      $scope.items2 = $scope.booklist;
      $scope.$watch('searchBook', function(val){
        $sceope.booklist = $filter('searchFor')($scope.items2, val);
      });
    } else {
      $scope.booklist = [];
    }
  });
  $scope.editBook = function($index){
    $scope.number = ($scope.pageSize * ($scope.currentPage - 1)) + $index;
    sharedbook.setProperty($scope.booklist[$sceope.number]);
    $state.go('Editbook');
  };
});

//Controller for newbook.html
app.controller('add-new-book', function($scope, $http, $state){
  $scope.bookdata = {};
  $scope.addBook = function() {
    var payload = {
      "bookname":$scope.bookdata.bookname,
      "authorname":$scope.bookdata.authorname,
      "price":$scope.bookdata.price
    }
    $http.post("http://localhost:8080/book", payload).success(function(res){
      if(res.error == 0) {
        $state.go("home");
      } else {

      }
    });
  };
});

//Controller for editbook.html
app.controller('edit-book',function($scope, $http, $state, sharedbook){
    $scope.bookdata = sharedbook.getProperty();
    $scope.updateBook = function(){
        var payload = {
            "id":$scope.bookdata._id,
            "bookname":$scope.bookdata.bookname,
            "authorname":$scope.bookdata.authorname,
            "price":$scope.bookdata.price
        }
        $http.put("http://localhost:8080/book",payload).success(function(res){
            if(res.error == 0){
                $state.go("home");
            } else {

            }
        });
    };
    $scope.cancel = function(){
        $state.go("home");
    };
});

//Deleting book data - deleteBook
$scope.deleteBook = function($index){
    $scope.number = ($scope.pageSize * ($scope.currentPage - 1)) + $index;
    $http.delete("http://localhost:8080/book/" + $scope.booklist[$scope.number].bookname).success(function(res){
        if(res.error == 0){
            $state.go($state.current, {}, {reload: true});
        } else {

        }
    });
};

//Search Books - SearchFor:searchBook
app.filter('searchFor', function(){
    return function(arr, searchBook){
        if(!searchBook){
            return arr;
        }
        var result = [];
        searchBook = searchBook.toLowerCase();
        angular.forEach(arr, function(item){
            if(item.bookname.toLowerCase().indexOf(searchBook) !== -1 || item.authorname.toLowerCase().indexOf(searchBook) !== -1){
            result.push(item);
        }
        });
        return result;
    };
});
