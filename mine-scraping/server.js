'use strict'

var express = require('express');
var _ = require('underscore');
/*var recipes_p = require('./modules/recipes_parser');
var items_p = require('./modules/items_parser');*/
var SCRAPER = require('./modules/scraper');

var BLOCKS = [];
var ITEMS = [];
var IMAGES = [];
var RECIPES = [];
var _PRUEBAS;

//Starting the server
console.log("Starting server...");
var app = express();
app.use(express.static(__dirname + '/public'));


//Routing
app.get('/scrap/:section', function (req, res) {
	var section = req.params.section;
	switch(section){
		case 'items' : res.send(ITEMS); break;
		case 'blocks' : res.send(BLOCKS); break;
		case 'images' : res.send(IMAGES); break;
		case 'recipes' : res.send(RECIPES); break;
		case 'pruebas' : res.send(_PRUEBAS); break;
	}
});


//This function is called when all the data is obtained
var dataObtained = _.after(1, function(){
	app.listen(process.env.PORT || 3000);
	console.log("Server started");
});

/****************** Getting data ********************/
SCRAPER.scrap(function(data){
	_PRUEBAS = data.details;
	ITEMS = data.items;
	RECIPES = data.crafts;
	app.listen(process.env.PORT || 3000);
	console.log("Server started");
})

//This function is called when all ids are gotten
/*var idObtained = _.after(2, function(){
	var ids = BLOCKS.concat(ITEMS);
	console.log("- Images obtained");
	recipes_p.parse(function(response){
		RECIPES = response;
		console.log("- Recipes obtained");
		dataObtained();
	}, ids);
});

items_p.parse("Item", function(response){
	ITEMS = response.items;
	IMAGES = IMAGES.concat(response.images);
	console.log("- Items ids obtained");
	idObtained();
});

items_p.parse("Block", function(response){
	BLOCKS = response.items;
	IMAGES = IMAGES.concat(response.images);
	console.log("- Blocks ids obtained");
	idObtained();
});*/

/******************************************************/

