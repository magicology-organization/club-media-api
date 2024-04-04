// dbConfig.js
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "mahou-db.csu9y7b3a0hk.us-east-1.rds.amazonaws.com",
  user: "hmoms-app",
  password: "app-pwd",
  database: "hmoms",
});
//command to connect mysql via ubuntu
// mysql -u hmoms-app -p -h mahou-db.csu9y7b3a0hk.us-east-1.rds.amazonaws.com -P 3306 hmoms

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database as ID " + connection.threadId);
});

module.exports = connection;
