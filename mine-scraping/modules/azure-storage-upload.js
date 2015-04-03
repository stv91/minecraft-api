var azure = require('azure-storage');
var blobSvc = azure.createBlobService();
var containerName = "v1";

var initilize = function() {
	// publicAccessLevel: blob: Allow anonymous access to blob but no container metadata or blob list.
	blobSvc.createContainerIfNotExists(containerName, {publicAccessLevel : 'blob'}, function(error, result, response){
	  if(!error){
	    // Container exists and is private
	  }
	});
}

var uploadFile = function(name, file) {
	blobSvc.createBlockBlobFromLocalFile(containerName, name, file, function(error, result, response){
	  if(!error){
	    // file uploaded
	  }
	});
}

// 
module.exports = {initilize: initilize, uploadFile: uploadFile};