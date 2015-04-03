var sql = require('mssql'); 
 

 
var config = {
    user: '',
    password: '',
    server: '', // You can use 'localhost\\instance' to connect to named instance 
    database: '',
    
    options: {
        encrypt: true // Use this if you're on Windows Azure 
    }
}
 
var insertItem = function(item) {
    
    var queryString = "INSERT INTO Items (Id, Name, DisplayName, Type, Stackable) VALUES ('" + item.id + "', '" 
            + item.name + "', '"
            + item.displayName + "', '"
            + item.type + "', '"
            + item.stackable + "')";

console.log(queryString);
    var connection = new sql.Connection(config, function(err) {
    if(err) {
        console.log(err);
    }
    else
    {
        var request = new sql.Request(connection);

        request.query(queryString, function(err, recordset) {
            console.log("Response");
            console.log(err);
            console.log(recordset);
        });
    }
        
});

};


module.exports = {insertItem: insertItem};
