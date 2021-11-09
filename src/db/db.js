const mysql = require('mysql')
const con  = mysql.createConnection({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'login-access'
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
module.exports = con