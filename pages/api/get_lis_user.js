const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});

connection.connect(function (err) {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database as id " + connection.threadId);
});

export default function handler(req, res) {
  const query = `SELECT 
  fname AS value,
  fname AS label
  FROM lis_user`;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.error(err);
      return;
    }
    res.status(200).json(rows);
  });
}
