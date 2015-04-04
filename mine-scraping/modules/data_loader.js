var jf = require('jsonfile');
var fs = require('fs');
var scraper = require('./scraper');
var _ = require('underscore');

var file_manager = {
	base_path : './data/',
	files : {
		items : "items.json",
		crafts : "crafts.json",
		potions : "potions.json",
		bakeds : "bakeds.json"
	},
	exists : function(file){
		return fs.existsSync(this.base_path + this.files[file]);
	},
	existsAll : function(){
		var files = Object.keys(this.files);
		for(var i = 0; i < files.length; i++){
			if(!this.exists(files[i]))
				return false;
		}
		return true;
	},
	saveSync : function(file, data){
		if (!fs.existsSync(this.base_path)){
			console.log("creating " + this.base_path);
		    fs.mkdirSync(this.base_path);
		}
		console.log("saving " + this.files[file]);
		jf.writeFileSync(this.base_path + this.files[file], data);
	},
	readSync : function(file){
		console.log("reading " + this.files[file]);
		return jf.readFileSync(this.base_path + this.files[file]);
	},
	saveAsync : function(file, data, cb){
		if (!fs.existsSync(this.base_path)){
			console.log("creating " + this.base_path);
		    fs.mkdirSync(this.base_path);
		}
		console.log("saving " + this.files[file]);
		jf.writeFile(this.base_path + this.files[file], data, cb);
	},
	readAsync : function(file, cb){
		console.log("reading " + this.files[file]);
		return jf.readFile(this.base_path + this.files[file], cb);
	},
	readAll : function(){
		var data = {};
		for(key in this.files){
			data[key] = this.readSync(key);
		}
		return data;
	},
	saveAll : function(data){
		for(key in this.files){
			this.saveAsync(key, data[key]);
		}
	},
}


function getData(options, func){
	if(!options.reset && !options.refresh && file_manager.existsAll()){ //All data is gotten from json files
		var data = file_manager.readAll();
		func(data);
	}
	else if(options.reset || (!options.reset && !options.refresh && !file_manager.existsAll())){ //All data is gotten from web scraping
		scraper.scrap(function(data){
			file_manager.saveAll(data);
			func(data)
		})
	}
	else { //refreshing some data sections
		var items = file_manager.readSync('items');
		var toCall = [];
		var toRead = _.difference(Object.keys(file_manager.files), options.refresh);
		for(i in options.refresh){
			var opc = options.refresh[i];
			toCall.push("get" + opc[0].toUpperCase() + opc.slice(1));
		}
		scraper.scrap(function(data) {
			for(i in toRead){
				if(toRead[i] != 'items')
					data[toRead[i]] = file_manager.readSync(toRead[i]);
			}
			file_manager.saveAll(data);
			func(data);
		}, items, toCall)
	}
	
}

module.exports = {getData: getData};