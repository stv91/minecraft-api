var settings = (function (){

	var db_user = process.env.DB_USER;
	var db_password = process.env.DB_PASSWORD;
	var db_server = process.env.DB_SERVER;
	var db_database = process.env.DB_DATABASE;


    return {
        db_user: db_user,
        db_password: db_password,
        db_server: db_server,
        db_database: db_database
    };
})();

module.exports = settings;