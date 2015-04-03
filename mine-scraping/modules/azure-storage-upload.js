var azure = require('azure-storage');
var fs = require('fs');
var request = require('request');

var blobSvc = azure.createBlobService();
var containerName = "minecraftv1";

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

// Enviroment variables
// AZURE_STORAGE_ACCOUNT and
// AZURE_STORAGE_ACCESS_KEY or
// AZURE_STORAGE_CONNECTION_STRING 

var initialize = function() {
	// publicAccessLevel: blob: Allow anonymous access to blob but no container metadata or blob list.
	blobSvc.createContainerIfNotExists(containerName, {publicAccessLevel : 'blob'}, function(error, result, response){
	  if(!error){
	    // Container exists and is private
	  }
	});
}

var uploadFile = function(name, file) {
	download(file, name, function () {
		uploadLocalFile(name, file);
	});
}

var uploadLocalFile = function(name, file) {
	blobSvc.createBlockBlobFromLocalFile(containerName, name, name, function(error, result, response){
  		if(error){
    		console.log(response);
  		}
	});
}

// 
module.exports = {initialize: initialize, uploadFile: uploadFile, uploadLocalFile: uploadLocalFile};