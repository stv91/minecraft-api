var sql = require('mssql'); 
var settings = require('./settings');

var config = {
    user: settings.db_user,
    password: settings.db_password,
    server: settings.db_server,
    database: settings.db_database,
    
    options: {
        encrypt: true // Use this if you're on Windows Azure 
    }
}

var createValuesQuery = function(item) {

    var fields = [];
    var values = [];

    if(item.id)
    {
        fields.push("Id");
        values.push(item.id);
    }

    if(item.name)
    {
        fields.push("Name");
        values.push(item.name);
    }

    if(item.displayName)
    {
        fields.push("DisplayName");
        values.push(item.displayName);
    }

    if(item.type)
    {
        fields.push("Type");
        values.push(item.type);
    }

    if(item.stackable)
    {
        fields.push("Stackable");
        values.push(item.stackable);
    }

    if(fields.length) {
        var fieldsQuery = "" + fields[0];
        var valuesQuery = "'" + values[0] + "'";

        for (var i = 1; i < fields.length; i++) {
            fieldsQuery += ", " + fields[i];
            valuesQuery += ", '" + values[i] + "'";
        };

        return "(" + fieldsQuery + ') VALUES (' + valuesQuery + ')'; 
    }
    else
    {
        return "";
    }
}

var query = function(queryString, callback) {
    console.log(queryString);
    var connection = new sql.Connection(config, function (error) {
        if(error)
            console.error(error);
        
        var request = new sql.Request(connection);
        request.query(queryString, function(err, recordset) {
            connection.close();
            callback(err, recordset);
        });
    });
}
 
var insertItem = function(item, callback) {
    
    var itemQuery = createValuesQuery(item);

    if(itemQuery) {
        var queryString = "INSERT INTO Items" + itemQuery;
        
        query(queryString, callback);
        
    }
};

var getAllItems = function(page, callback) {
    var tam = 20;
    var offset = page * tam;

    var queryString = "SELECT * FROM Items ORDER BY Id OFFSET " + offset + " ROWS FETCH NEXT " + tam + " ROWS ONLY;";// RowNum >= " + offset + " AND RowNum <= " + (tam - offset);

    console.log(queryString);

     query(queryString, callback);
}

module.exports = {insertItem: insertItem, getAllItems: getAllItems};
