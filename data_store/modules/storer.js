var actions = {
	insertItems : function(data){
		var pos = 0;
		function next(){
			if(pos < data.items.length) {
				var item = data.items[pos];
				azure_sql.insertItem({id: item.dec, name: item.name, displayName: item.block, type: item.type, stackable: item.stackable},
					next);
				pos++;
			}
		}
		next();
	},
	storeImages : function(data){
		var pos = 0;
		function next(){
			if(pos < data.items.length) {
				var item = data.items[pos];
				if(item.dec && item.img){
					azure_storage.uploadFile(item.dec,item.img, next);
				}
				else{
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