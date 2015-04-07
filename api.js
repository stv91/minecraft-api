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
	var max = 20;
	azure_sql.getItemsCount(function(errorCount, count) {
		if(!errorCount) {
            var itemsCount = (count[0] && count[0]['']) ? count[0][''] : 0;
            var fullUrl = req.protocol + '://' + req.get('host') + "/api/items/";
            var last = Math.floor(itemsCount/max);

            var next = (!page || page < last) ? fullUrl + (+1 + +page) : null;
            var previous = (page && page != "0") ? fullUrl + (+page + -1) : null;
            if(page < 0 || page > last) {
            	next = previous = null;
            }

            azure_sql.getItems(page, max, function(itemsError, items) {
            	if(!itemsError) {
		            var response = { totalCount: itemsCount, previous: previous, next: next, items: items };
					res.json(response);
            	} else {
        			res.send("Items Error");
            	}
            });
        } else {
        	res.send("Items Count Error");
        }
	});
	/*var response = azure_sql.getAllItems(page, req, function(err, recordset) {
		res.json(recordset);
	});*/
});

app.get('/api/version', function (req, res) {
	res.send("Version " + process.env.VERSION + " USER:" + settings.db_user);
});

app.get('/api/version', function (req, res) {
	res.send("Hola mundo");
});

var port = process.env.PORT || 3000;
app.listen(port);

console.log('Api started. Port ' + port);
