const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

/* -------- FIX FOR "Cannot GET /" -------- */

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

/* -------- DATABASE CONNECTION -------- */

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "deepu",
  database: "cloud_catalog"
});

db.connect(err => {
  if (err) throw err;
  console.log("Database Connected");
});

/* ---------------- USAGE TRACKING ---------------- */

app.post('/update-usage/:id', (req, res) => {

  const id = req.params.id;

  db.query(
    "UPDATE applications SET usage_count = usage_count + 1 WHERE id = ?",
    [id],
    (err) => {

      if (err) {
        res.status(500).send(err);
      } else {
        res.send("Usage updated");
      }

    });
});

/* ---------------- ADD APPLICATION ---------------- */

app.post("/addApp", (req, res) => {

  const { name, category, version, dependencies, tags } = req.body;

  const sql = "INSERT INTO applications(name,category,version,dependencies,tags) VALUES(?,?,?,?,?)";

  db.query(sql, [name, category, version, dependencies, tags], (err, result) => {

    if (err) throw err;

    res.send("Application Added");

  });

});

/* ---------------- GET ALL APPLICATIONS ---------------- */

app.get("/apps", (req, res) => {

  db.query("SELECT * FROM applications", (err, result) => {

    res.json(result);

  });

});

/* ---------------- SEARCH APPLICATION ---------------- */

app.get("/search", (req, res) => {

  const keyword = req.query.keyword;

  db.query(
    "SELECT * FROM applications WHERE name LIKE ?",
    ["%" + keyword + "%"],
    (err, result) => {

      res.json(result);

    });

});

/* ---------------- ANALYTICS ---------------- */

app.get("/analytics", (req, res) => {

  db.query(
    "SELECT name,usage_count FROM applications ORDER BY usage_count DESC LIMIT 5",
    (err, result) => {

      res.json(result);

    });

});

/* ---------------- RECOMMENDATION BY CATEGORY ---------------- */

app.get("/recommend/:category", (req, res) => {

  const category = req.params.category;

  db.query(
    "SELECT * FROM applications WHERE category=? ORDER BY usage_count DESC LIMIT 3",
    [category],
    (err, result) => {

      res.json(result);

    });

});

/* ---------------- UPDATE APPLICATION ---------------- */

app.put("/updateApp/:id", (req, res) => {

  const { name, category, version, dependencies, tags } = req.body;

  db.query(
    "UPDATE applications SET name=?, category=?, version=?, dependencies=?, tags=? WHERE id=?",
    [name, category, version, dependencies, tags, req.params.id],
    (err, result) => {

      if (err) throw err;

      res.send("Application Updated");

    });

});

/* ---------------- DELETE APPLICATION ---------------- */

app.delete("/deleteApp/:id", (req, res) => {

  db.query(
    "DELETE FROM applications WHERE id=?",
    [req.params.id],
    (err, result) => {

      if (err) throw err;

      res.send("Application Deleted");

    });

});

/* ---------------- FILTER BY CATEGORY ---------------- */

app.get("/filter", (req, res) => {

  const category = req.query.category;

  db.query(
    "SELECT * FROM applications WHERE category=?",
    [category],
    (err, result) => {

      res.json(result);

    });

});

/* ---------------- USER BASED RECOMMENDATION ---------------- */

app.get("/userRecommend/:userid", (req, res) => {

  db.query(
    "SELECT preferred_category FROM users WHERE id=?",
    [req.params.userid],
    (err, result) => {

      if (err) throw err;

      let category = result[0].preferred_category;

      db.query(
        "SELECT * FROM applications WHERE category=?",
        [category],
        (err, apps) => {

          res.json(apps);

        });

    });

});

/* ---------------- START SERVER ---------------- */

app.listen(3000, () => {
  console.log("Server running on port 3000");
});