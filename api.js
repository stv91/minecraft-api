'use strict'

var express = require('express');
var azure_sql = require("./data_store/modules/azure-sql");
var cors = require('cors');
var settings = require('./data_store/modules/settings');


var app = express();
app.use(express.static(__dirname + '/public'));
app.use(cors());

//Routing
/*app.get('/api/items/:page?', function (req, res) {
	var page = req.params.page || 0;
	//page = Number.isInteger(page) ? page : 0;
	var response = azure_sql.getAllItems(page, function(err, recordset) {
		res.json(recordset);
	});
});

app.get('/api/version', function (req, res) {
	res.send("Version " + process.env.VERSION + " USER:" + settings.db_user);
});

var port = parseInt(process.env.PORT) || 3000;
app.listen(port);

process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
})*/

app.get('/api/version', function (req, res) {
	res.send("Hola mundo");
});

var port = process.env.PORT || 3000;
app.listen(port);

console.log('Api started. Port ' + port);
