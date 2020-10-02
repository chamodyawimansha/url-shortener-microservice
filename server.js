"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var dns = require("dns");

var cors = require("cors");

var app = express();

var urlSchema = new Schema({
  url: String,
  hash: String,
});

// Basic Configuration
var port = process.env.PORT || 8000;

/** this project needs a db !! **/
// mongoose.connect(
//   "mongodb+srv://db_user:xJS$50r3UzCB@cluster0.jgion.mongodb.net/apiTestDb?retryWrites=true&w=majority",
//   { useNewUrlParser: true, useUnifiedTopology: true }
// );
// var db = mongoose.connection;

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl/new", function (req, res) {
  // remove the http from the url
  let url = req.body.url;
  url = url.replace(/^https?:\/\//i, "");

  // check if the url is correct or not
  dns.lookup(url, (err) => {
    if (err && err.code === "ENOTFOUND") {
      res.json({ error: "invalid URL" });
    }
  });

  db.once("open", function () {});

  res.send("DB Connection Error");

  //Save the url in the database
});

app.get("api/shorturl", function (req, res) {});

app.listen(port, function () {
  console.log("Node.js listening ...");
});
