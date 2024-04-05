// dbConfig.js
require("dotenv").config();
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
