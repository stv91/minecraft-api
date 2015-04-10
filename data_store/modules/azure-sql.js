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

var connection = new sql.Connection(config);
var tryConnect = function() {
    connection.connect(function (error){
        if(error)
        {
           tryConnect(); 
        }
    });
}

tryConnect();

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

    var request = new sql.Request(connection);
    request.query(queryString, function(err, recordset) {
        //connection.close();
        callback(err, recordset);
    });
}
 
var insertItem = function(item, callback) {
    
    var itemQuery = createValuesQuery(item);

    if(itemQuery) {
        var queryString = "INSERT INTO Items" + itemQuery;
        
        query(queryString, function(err, recordset) { callback(err, recordset); });
        
    }
};

var virtualizedData = function(baseQueryString, page, max, callback) {
    var max = 20;
    var offset = page * max;

    var queryString = baseQueryString + " OFFSET " + offset + " ROWS FETCH NEXT " + max + " ROWS ONLY;";
    query(queryString, callback);
}

var getItems = function(page, max, callback) {
    var baseQueryString = "SELECT * FROM Items ORDER BY Id";
    virtualizedData(baseQueryString, page, max, callback);
} 

var getItemsCount = function(callback) {
    var countQueryString = "SELECT COUNT(*) FROM Items";
    query(countQueryString, callback);
} 

var getItemsByType = function(type, page, max, callback) {
    var baseQueryString = "SELECT * FROM Items WHERE Type = '" + type + "' ORDER BY Id";
    virtualizedData(baseQueryString, page, max, callback);
} 

var getItemsCountByType = function(type, callback) {
    var countQueryString = "SELECT COUNT(*) FROM Items WHERE Type = '" + type + "'";
    query(countQueryString, callback);
} 

var getTypes = function(callback) {
    var queryString = "SELECT Distinct Type FROM Items";
    query(queryString, callback);
} 

module.exports = {insertItem: insertItem, getItems: getItems, getItemsCount: getItemsCount, getItemsByType: getItemsByType, getItemsCountByType: getItemsCountByType, getTypes: getTypes};
