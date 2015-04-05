var azure_storage = require('./azure-storage-upload');
var azure_sql = require('./azure-sql');

var actions = {
	insertItems : function(data){
		var pos = 0;
		function next(){
			if(data && data.items && pos < data.items.length) {
				var item = data.items[pos];
				pos++;
				azure_sql.insertItem({id: item.dec, name: item.name, displayName: item.block, type: item.type, stackable: item.stackable},
					next);
			}
			else {
				pos++;
				if(pos < data.items.length) {
					next();
				}
			}
		}
		next();
	},
	storeImages : function(data){
		var pos = 0;
		function next(){
			var index = pos;
			pos++;
			if(data && data.items && index < data.items.length) {
				var item = data.items[index];
				if(item.dec && item.img){
					azure_storage.uploadFile(item.dec,item.img, next);
				}
				else{
					next();
				}
			}
			else {
				if(pos < data.items.length) {
					next();
				}
			}
		}
		next();
	}
}

//In this function it will be processed de app options
//to choose which action should be done, 
//for the moment it return all actions
function optionsProcessor(options){
	return actions;
}

function store(data, options) {
	var act = optionsProcessor(options);
	for(name in actions){
		actions[name](data);
	}
}


module.exports = {store: store};