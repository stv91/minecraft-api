'use strict';

var app = angular.module('mine-scraping');

app.controller('items-controller', function($scope, $http, $routeParams, $location) {
	$scope.title = 'Items';
	$http.get('/scrap/items').then(function(items) {
		$scope.json =  JSON.stringify(items.data, null, 2);
		$scope.items = items.data;
	});
});