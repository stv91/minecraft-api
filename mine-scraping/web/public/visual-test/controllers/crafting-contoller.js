'use strict';

var app = angular.module('mine-scraping');

app.controller('crafting-controller', function($scope, $http, $routeParams, $location) {
	var section = $routeParams.section;
	$scope.title = 'Crafting';
	$http.get('/scrap/crafts').then(function(results) {
		$scope.json =  JSON.stringify(results.data, null, 2);
	});
});