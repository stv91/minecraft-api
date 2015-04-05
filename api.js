'use strict'

var express = require('express');
var azure_sql = require("./data_store/modules/azure-sql");
var cors = require('cors');
var settings = require('./data_store/modules/settings');


var app = express();
app.use(express.static(__dirname + '/public'));
app.use(cors());

//Routing
app.get('/api/items/:page?', function (req, res) {
	var page = req.params.page || 0;
	page = Number.isInteger(page) ? page : 0;
	var response = azure_sql.getAllItems(page, function(err, recordset) {
		//res.json(recordset);
		res.send("Error: " + err + "<br/> Recordset:" + recordset);
	});
});

app.get('/api/version', function (req, res) {
	res.send("Version " + process.env.VERSION + " USER:" + settings.db_user);
});

var port = 3000;
app.listen(process.env.PORT || port);

console.log('Api started. Port ' + port);
