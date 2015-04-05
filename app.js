'use strict'

var stdio = require('stdio');
var data_loader = require('./mine-scraping/modules/data_loader');
var server = require('./mine-scraping/web/server');
var ds;
try {
	ds = require('./data_store/modules/storer');
}
catch(err){
	console.log(err);
}


//app arguments 
var args = {
	refresh_opc : ["crafts", "potions", "bakeds"],
	/*refresh_opc_string : function() {
		var string = "[";
		for(i in this.refresh_opc){
			string += string == "["? this.refresh_opc[i] : " | " + this.refresh_opc[i];
		}
		return string + "]";
	},*/
	options : stdio.getopt({
	    'reset': {description: 'Redo all web scraping'},
	    'refresh': {args : '*', description: 'Redo web scraping of the specified sections [crafts | potions | bakeds]'},
	    'web-server' : {description : 'Set up the web server to test web scraping'},
	    'store' : {description : 'Sets web scraping data to db and storage'},
	    'api' : {description : 'Set up api web server'},
	}),
	checks : function(){
		if(this.options.refresh === true)
			console.log("--refresh option must have one or more arguments. \nTry \"--help\" for more information.");
		else if(this.options.refresh){
			if(!Array.isArray(this.options.refresh))
				this.options.refresh = [this.options.refresh];

			for(var i in this.options.refresh){
				var ok = false;
				for(var j in this.refresh_opc){
					if(this.options.refresh[i] == this.refresh_opc[j]){
						ok = true;
						break;
					}
				}
				if(!ok){
					console.log(this.options.refresh[i] + " is not a valid option. \nTry \"--help\" for more information.");
					break;
				}
			}
		}
	}
};

//checking app options
args.checks();

if(args.options["reset"] || args.options["refresh"] 
	|| args.options["web-server"] || args.options["store"]){

	data_loader.getData(args.options, function(data){
		if(args.options["web-server"])
			server.start(data);
		if(args.options["store"])
			storer.store();
		if(args.options["api"])
			require('./api');

	});
}
else if(args.options["api"]){
	require('./api');
}