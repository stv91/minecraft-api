'use strict'

var stdio = require('stdio');
var data_loader = require('./modules/data_loader');
var server = require('./modules/testing_server');

//app arguments 
var args = {
	refresh_opc : ["crafts", "potions", "bakeds"],
	refresh_opc_string : function() {
		var string = "[";
		for(i in this.refresh_opc){
			string += string == "["? this.refresh_opc[i] : " | " + this.refresh_opc[i];
		}
		return string + "]";
	},
	options : stdio.getopt({
	    'reset': {description: 'Redo all web scraping'},
	    'refresh': {args : '*', description: 'Redo web scraping of the specified sections ' + this.refresh_opc_string},
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

data_loader.getData(args.options, function(data){
	server.start(data);
});

