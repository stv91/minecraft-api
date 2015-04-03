var _ = require('underscore');
var RECIPES_P = require('./recipes_parser');
var IDS_P = require('./ids_parser');
var DETAIL_P = require('./detail_page_parser');

var ID_URLS = {
	"base_url" : "http://minecraft.gamepedia.com/Data_values/",
	"pages" : ["Block_IDs","Item_IDs"],
	getAll : function(){
		var urls = [];
		for(i in this.pages){
			urls.push(this.base_url + this.pages[i]);
		}
		return urls;
	}
};

var RECIPES_URLS = {
	"base_url" : "http://minecraft.gamepedia.com/Crafting/",
	"pages" : [
		"Brewing", "Building_blocks", "Combat",
		"Decoration_blocks", "Dye", "Foodstuffs",
		"Materials", "Miscellaneous", "Redstone",
		"Tools", "Transportation"
	],
	getAll : function(){
		var urls = [];
		for(i in this.pages){
			urls.push(this.base_url + this.pages[i]);
		}
		return urls;
	}
};

var POTIONS_URL = "http://minecraft.gamepedia.com/Potion_crafting";
var SMELTING_URL = "http://minecraft.gamepedia.com/Smelting";


/********************** GETTING DATA *********************/

function getIds(func){
	var out = [];
	var urls = ID_URLS.getAll();
	var finished = _.after(urls.length, function() {
		console.log("- IDs obtained");
		func(out) 
	});

	function setIds(ids){
		out = out.concat(ids);
		finished();
	}

	for(i in urls){
		IDS_P.parse(urls[i], setIds);
	}
}


var PARALLEL_SCRAPS = {
	getDetails : function (ids, func) {
		var out = [];
		var inc = 10;
		//Math.round(ids.length/inc),
		var finished = _.after(ids.length, function() {
			console.log("- Details obtained");
			func({details : out});
		});

		var pos = 0;
		function step(){
			var i = 0;
			while(i < inc && pos < ids.length){
				var go_on;
				if(ids.length - pos > inc)
					var go_on = _.after(inc, step);
				else
					var go_on = _.after(ids.length - pos, step);

				DETAIL_P.parse(pos, ids, function(detail) { 
					out = out.concat(detail);
					finished();
					go_on();
				});
				pos++;
				i++;
			}	
		}

		step();
	},
	getCrafts : function (ids, func){
		var out = [];
		var urls = RECIPES_URLS.getAll();

		var finished = _.after(urls.length, function() {
			console.log("- Crafts obtained");
			func({crafts : out}); //scarpt.setData
		});

		for(i  in urls){
			RECIPES_P.parse(urls[i], ids, function(crafts){
				out = out.concat(crafts);
				finished();
			});
		}
	},
	getPotions : function(ids, func){
		/*function(potions){
			func({potions : potions});
		}*/
		func({potions : "Comming soon"});
		
	},
	getBakeds : function(ids, func){
		/*function(bakeds){
			func({bakeds : bakeds});
		}*/
		func({backeds : "Comming soon"});
	}
}


/******************* Module main function **********************/

function scrap(func){
	var out = {
		items: []
	};
	var finished = _.after(Object.keys(PARALLEL_SCRAPS).length, function() {
		console.log("- Scraping finished");
		func(out);
	});

	function setData(data){
		out = _.extend(out, data);
		finished();
	}

	getIds(function(ids){
		out.items = ids;
		console.log("- Starting scraping");
		for(scrap in PARALLEL_SCRAPS){
			PARALLEL_SCRAPS[scrap](ids, setData);
		}
	});
}

module.exports = {scrap: scrap};