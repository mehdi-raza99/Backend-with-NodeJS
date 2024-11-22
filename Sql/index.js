const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
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
      res.render("home", { UserCount: result[0].TotalUsers });
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/user", (req, res) => {
  let q = "SELECT *  FROM user;";
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("user", { users });
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `Select * from user where id = '${id}'`;
  try {
    connection.query(q, (err, user) => {
      if (err) throw err;
      res.render("edit.ejs", { user: user[0] });
    });
  } catch (err) {
    console.log(err);
  }
});

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let q = `Select * from user where id = '${id}'`;
  try {
    connection.query(q, (err, user) => {
      if (err) throw err;
      let { username: newUsername, password } = req.body;
      if (user[0].password === password) {
        let q = `Update user set username='${newUsername}' where id = '${id}'`;
        try {
          connection.query(q, (err, user) => {
            if (err) throw err;
            res.redirect("/user");
          });
        } catch (err) {
          console.log(err);
        }
      } else res.send("<h1>Wrong Password</h1>");
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/user/new", (req, res) => {
  res.render("new");
});

app.post("/user", (req, res) => {
  let { id, password, email, username } = req.body;
  let q = `INSERT INTO user values ('${id}','${username}','${email}','${password}')`;
  try {
    connection.query(q, (err, user) => {
      if (err) throw err;
      res.redirect("/user");
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `Select * from user where id = '${id}'`;
  try {
    connection.query(q, (err, user) => {
      if (err) throw err;
      res.render("delete", { user: user[0] });
    });
  } catch (err) {
    console.log(err);
  }
});

app.delete("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let { email: EnteredEmail, password: EnteredPassword } = req.body;
  let q = `Select * from user where id = '${id}'`;
  try {
    connection.query(q, (err, user) => {
      if (err) throw err;
      let { email, password } = user[0];
      if (EnteredEmail === email && EnteredPassword === password) {
        let q = `DELETE FROM user WHERE email = '${EnteredEmail}';`;
        try {
          connection.query(q, (err, user) => {
            if (err) throw err;
            res.redirect("/user");
          });
        } catch (err) {
          console.log(err);
        }
      } else res.send("<h1>Wrong input!</h1>");
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log("Sever Started");
});
