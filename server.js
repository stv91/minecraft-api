'use strict'

var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var table_parser = require('./modules/table_parser');


//Inicializamos el servidor
var app = express();

app.use(express.static(__dirname + '/public'));

function getUrl(section){
	var url = "http://minecraft.gamepedia.com/api.php?action=parse&format=json&prop=text&title=Crafting&text=";
	switch(section){
		case "building-blocks": url += "%7B%7B%3ACrafting%2FBuilding+blocks%7D%7D"; break;
		case "decoration-blocks": url += "%7B%7B%3ACrafting%2FDecoration+blocks%7D%7D"; break;
		case "redstone": url += "%7B%7B%3ACrafting%2FRedstone%7D%7D"; break;
		case "transportation": url += "%7B%7B%3ACrafting%2FTransportation%7D%7D"; break;
		case "foodstuffs": url += "%7B%7B%3ACrafting%2FFoodstuffs%7D%7D"; break;
		case "tools": url += "%7B%7B%3ACrafting%2FTools%7D%7D"; break;
		case "combat": url += "%7B%7B%3ACrafting%2FCombat%7D%7D"; break;
		case "brewing": url += "%7B%7B%3ACrafting%2FBrewing%7D%7D"; break;
		case "materials": url += "%7B%7B%3ACrafting%2FMaterials%7D%7D"; break;
		case "miscellaneous": url += "%7B%7B%3ACrafting%2FMiscellaneous%7D%7D"; break;
	}
	return url;
}


// Definición de las rutas
app.get('/:section', function (req, res) {
	var url = getUrl(req.params.section);
	request(url, function (error, response, body) {
			var json = JSON.parse(body)
			var html = json.parse.text["*"];
	        res.json(table_parser.parse(html));
	});
});


app.get('/source/:section', function (req, res) {
	var url = getUrl(req.params.section);
	request(url, function (error, response, body) {

			var json = JSON.parse(body)
			var html = json.parse.text["*"];
	        res.send(html);
	});
});

// Esuchamos las peticiones para procesarlas
app.listen(process.env.PORT || 3000);