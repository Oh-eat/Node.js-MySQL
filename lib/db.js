// user and password are censored

var mysql = require('mysql');
var db = mysql.createConnection({
  host: 'localhost',
  user: '',
  password: '',
  database: 'opentutorials'
});
module.exports = db;
