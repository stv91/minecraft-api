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

var getAllItems = function(page, req, callback) {
    var tam = 20;
    var offset = page * tam;

    var queryString = "SELECT * FROM Items ORDER BY Id OFFSET " + offset + " ROWS FETCH NEXT " + tam + " ROWS ONLY;";// RowNum >= " + offset + " AND RowNum <= " + (tam - offset);

    console.log(queryString);
    query(queryString, function(itemsError, items) { 
        if(!itemsError) {
            var countQueryString = "SELECT COUNT(*) FROM Items";
            query(countQueryString, function(countErrors, count) { 
                if(!countErrors) {
                    var itemsCount = (count[0] && count[0]['']) ? count[0][''] : 0;
                    var fullUrl = req.protocol + '://' + req.get('host') + "/api/items/";
                    var last = itemsCount / tam;
                    var next = (!page || (+page+1) < last) ? fullUrl + (+1 + +page) : null;
                    var previous = (page && page != "0") ? fullUrl + (+page + -1) : null;

                    var response = { totalCount: itemsCount, previous: previous, next: next, items: items };
                    callback(countErrors, response); 
                }
                else {
                    callback(countErrors, count); 
                }
            });
        }
        else {
            callback(itemsError, items); 
        } 
    });
}

module.exports = {insertItem: insertItem, getAllItems: getAllItems};
