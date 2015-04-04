'use strict';

angular.module('mine-scraping', ['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: '/visual-test/views/default.html',
    })
    .when('/view/items', {
      templateUrl: '/visual-test/views/items.html',
      controller: 'items-controller'
    }) 
    .when('/view/crafting', {
      templateUrl: '/visual-test/views/crafting.html',
      controller: 'crafting-controller'
    })
    .otherwise({
      redirectTo: '/'
    });
  });