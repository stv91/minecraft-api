'use strict'

var express = require('express');
var azure_sql = require("./modules/azure-sql");

var app = express();
app.use(express.static(__dirname + '/public'));


//Routing
app.get('/api/items', function (req, res) {
	var response = azure_sql.getAllItems(function(err, recordset) {
		res.json(recordset);
	});
});

app.listen(process.env.PORT || 3000);
