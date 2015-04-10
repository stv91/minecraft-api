'use strict'

var express = require('express');
var azure_sql = require("./data_store/modules/azure-sql");
var cors = require('cors');
var settings = require('./data_store/modules/settings');

/* Fields */
var imageBaseUrl = "http://minecraftimages.blob.core.windows.net/minecraftv1/";
var itemsUrl = "/api/items/";
var itemBaseUrl = "/api/item/";
var typeBaseUrl = "/api/type/";
var typesBaseUrl = "/api/types/";

/* Initialize */
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(cors());

/* Params */
app.param('page',function(req, res, next, page){
    var regex = new RegExp(/^[0-9]+$/);
    if(regex.test(page)){
        next();
    }else{
    next('Bad route');
    }
});

app.param('id',function(req, res, next, id){
    var regex = new RegExp(/^[0-9]+$/);
    if(regex.test(id)){
        next();
    }else{
    next('Bad route');
    }
});

//Routing
app.get('/api/items/:page?', function (req, res) {
	var page = req.params.page || 0;
	var max = 20;
	azure_sql.getItemsCount(function(errorCount, count) {
		if(!errorCount) {
            var itemsCount = (count[0] && count[0]['']) ? count[0][''] : 0;
            var fullUrl = req.protocol + '://' + req.get('host') + itemsUrl;
            var last = Math.floor(itemsCount/max);

            var next = (!page || page < last) ? fullUrl + (+1 + +page) : null;
            var previous = (page && page != "0") ? fullUrl + (+page + -1) : null;
            if(page < 0 || page > last || itemsCount <= max) {
            	next = previous = null;
            }

            azure_sql.getItems(page, max, function(itemsError, items) {
                var baseUrl = req.protocol + '://' + req.get('host') + itemBaseUrl;
                items.forEach(function(item) {
                    item.imageUrl = imageBaseUrl + escape(item.Id);
                    item.url = baseUrl + escape(item.Id) + "/";
                });
            	if(!itemsError) {
		            var response = { 
                        totalCount: itemsCount, 
                        previous: previous, 
                        next: next, 
                        imageUrl: imageBaseUrl,
                        items: items 
                    };
					
                    res.json(response);
            	} else {
        			res.send("Items Error");
            	}
            });
        } else {
        	res.send("Items Count Error");
        }
	});
});

app.get('/api/item/:id', function (req, res) {
    var id = req.params.id || 0;
     azure_sql.getItem(id, function(error, response) {
        if(!error && response) {
            var item = response[0] || null;
            if(item) {
                item.imageUrl = imageBaseUrl + escape(item.Id);
                res.json({item: item});
            } else {
                res.send("Item Error");
            }

        } else {
            res.send("Item Error");
        }
    });
});

app.get('/api/type/:type/:page?', function (req, res) {
    var page = req.params.page || 0;
    var type = req.params.type || null;
    var max = 20;
    if(type) {
        var typeUrl = typeBaseUrl + escape(type) + "/";
        azure_sql.getItemsCountByType(type, function(errorCount, count) {
            if(!errorCount) {
                var itemsCount = (count[0] && count[0]['']) ? count[0][''] : 0;
                var fullUrl = req.protocol + '://' + req.get('host') + typeUrl;
                var last = Math.floor(itemsCount/max);

                var next = (!page || page < last) ? fullUrl + (+1 + +page) : null;
                var previous = (page && page != "0") ? fullUrl + (+page + -1) : null;
                if(page < 0 || page > last || itemsCount <= max) {
                    next = previous = null;
                }

                azure_sql.getItemsByType(type, page, max, function(itemsError, items) {
                    if(!itemsError) {
                        var baseUrl = req.protocol + '://' + req.get('host') + itemBaseUrl;
                        items.forEach(function(item) {
                            item.imageUrl = imageBaseUrl + escape(item.Id);
                            item.url = baseUrl + escape(item.Id) + "/";
                        });
                        var response = { 
                            totalCount: itemsCount, 
                            previous: previous, 
                            next: next, 
                            imageUrl: imageBaseUrl,
                            items: items 
                        };
                        
                        res.json(response);
                    } else {
                        res.send("Items Error");
                    }
                });
            } else {
                res.send("Items Count Error");
            }
        });
    }
    else 
    {
        res.send("Type is required");
    }
});

app.get('/api/types', function (req, res) {
     azure_sql.getTypes(function(errorTypes, response) {
        if(!errorTypes && response) {
            var typeUrl = req.protocol + '://' + req.get('host') + typeBaseUrl;
            response.forEach(function(type) {
                type.url = typeUrl + escape(type.Type) + "/";
            });
            res.json(response);
        } else {
            res.send("Items Error");
        }
    });
});

app.get('/api/main', function (req, res) {

    var host = req.protocol + '://' + req.get('host');
    var response = { 
        items: host + itemsUrl,
        types: host + typesBaseUrl
    };
    
    res.json(response);
});

var port = process.env.PORT || 3000;
app.listen(port);

console.log('Api started. Port ' + port);
