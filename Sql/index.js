const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta",
  password: "local123",
});

const user = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

app.get("/", (req, res) => {
  let q = "SELECT COUNT(*) AS `TotalUsers`  FROM user;";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.send("success");
      console.log(result[0].TotalUsers);
    });
  } catch (err) {
    console.log(err);
  }
  connection.end();
});

app.listen(port, () => {
  console.log("Sever Started");
});
