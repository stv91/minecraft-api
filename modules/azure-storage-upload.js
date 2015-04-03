var azure = require('azure-storage');
var fs = require('fs');
var request = require('request');

var blobSvc = azure.createBlobService();
var containerName = "minecraftv1";

// Enviroment variables
// AZURE_STORAGE_ACCOUNT and
// AZURE_STORAGE_ACCESS_KEY or
// AZURE_STORAGE_CONNECTION_STRING 

var download = function(uri, filename, callback, errorCallback){
  if(uri && filename) {
	  request.head(uri, function(err, res, body) {
	  	if(!err) {
		    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
		}
		else
		{
			errorCallback();
		}
	  });
	}
	else
	{
		errorCallback();
	}
};

// callback: error, result, response
var initialize = function(callback) {
	// publicAccessLevel: blob: Allow anonymous access to blob but no container metadata or blob list.
	blobSvc.createContainerIfNotExists(containerName, {publicAccessLevel : 'blob'}, callback);
}

var uploadFile = function(name, file, callback) {
	download(file, name, function () {
		uploadLocalFile(name, file, callback);
	}, callback);
}

var uploadLocalFile = function(name, file, callback) {
	blobSvc.createBlockBlobFromLocalFile(containerName, name, name, callback);
}

// 
module.exports = {initialize: initialize, uploadFile: uploadFile, uploadLocalFile: uploadLocalFile};