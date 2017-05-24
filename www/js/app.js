// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Stuff in here
    });
  })
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl',
      })
      .state('muro', {
        url: '/muro',
        templateUrl: 'templates/muro.html',
        controller: 'MuroCtrl',
      })
      .state('nuevo', {
        url: '/nuevo',
        templateUrl: 'templates/nuevo.html',
        controller: 'NuevoCtrl',
      })

    $urlRouterProvider.otherwise('/login');

  }).controller('LoginCtrl', ['$scope', '$ionicPopup', '$state', '$location', '$http', function ($scope, $ionicPopup, $state, $location, $http) {
    $scope.data = {};
    $scope.login = function () {

      $http({
        url: 'http://localhost:1111/user',
        method: "POST",
        data: $scope.data
      }).success(function (data, status, headers, config) {
        if (data.msg) {
          localStorage.setItem('user', JSON.stringify(data.msg[0]));

          $location.path('/muro');
        } else {
          var alertPopup = $ionicPopup.alert({
            title: 'Login failed!',
            template: 'Please check your credentials!'
          });
        }
      }).error(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      });
    }
  }]).controller('NuevoCtrl', ['$scope', '$ionicPopup', '$state', '$location', '$http', function ($scope, $ionicPopup, $state, $location, $http) {
    $scope.data = {};
    $scope.nuevo = function () {

      $http({
        url: 'http://localhost:1111/users',
        method: "POST",
        data: $scope.data
      }).success(function (data, status, headers, config) {
        console.log(data);

      }).error(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      });
    }
  }]).controller('MuroCtrl', ['$scope', '$ionicPopup', '$state', '$location', '$http', '$interval', function ($scope, $ionicPopup, $state, $location, $http, $interval) {
    $scope.data = {};
    var user = JSON.parse(localStorage.getItem('user'));
    console.log(user);


    $interval(function () {
      $http({
        url: 'http://localhost:1111/muro',
        method: "GET",
      }).success(function (data, status, headers, config) {
        $scope.publicacion = data.msg;
        console.log($scope.publicacion);
      }).error(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      });
    }, 5000);


    $scope.comentar = function () {
      $scope.data.id_usuario = user.id_usuario;
      var date = new Date();
      $scope.data.fecha = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();

      $http({
        url: 'http://localhost:1111/muro',
        method: "POST",
        data: $scope.data
      }).success(function (data, status, headers, config) {
        console.log(data.msg);
      }).error(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      });
    }
  }])
