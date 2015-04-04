'use strict'

var express = require('express');

function start(data) {
	var app = express();
	app.use(express.static(__dirname + '/public'));


	//Routing
	app.get('/scrap/:section', function (req, res) {
		var section = req.params.section;
		switch(section){
			case 'items' : res.send(data.items); break;
			case 'crafts' : res.send(data.crafts); break;
			case 'potions' : res.send(data.potions); break;
			case 'bakeds' : res.send(data.bakeds); break;
		}
	});
	app.listen(process.env.PORT || 3000);
	console.log("Server started");
}

module.exports = {start: start};