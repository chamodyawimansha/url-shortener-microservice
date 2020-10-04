var express = require("express");
const dns = require("dns");
const url = require("url");
var cors = require("cors");
var bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");

var app = express();

// Basic Configuration
const port = process.env.PORT;

app.use(cors());

/** this project needs to parse POST bodies **/

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

app.post("/api/shorturl/new", function (req, res) {
  // get the url from the request
  let parsedUrl = url.parse(req.body.url);

  if (parsedUrl.protocol === null) {
    return res.json({ error: "invalid URL" });
  }

  dns.lookup(parsedUrl.hostname, (error, address) => {
    if (address) {
      mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      const db = mongoose.connection;

      db.on("error", () => {
        return res.json({ error: "Database Error" });
      });

      const urlSchema = new mongoose.Schema({
        uniqueIdentifier: String,
        url: String,
      });

      // db.once("open", () => {});
      const Url = mongoose.model("Url", urlSchema);

      const newUrl = new Url({
        uniqueIdentifier: Date.now(),
        url: parsedUrl.href,
      });

      newUrl.save((err) => {
        if (err) {
          return res.json({ error: "Database Error" });
        }

        return res.json({
          original_url: newUrl.url,
          short_url: newUrl.id,
        });
      });
    } else {
      //send the error message if the url is not correct
      return res.json({ error: "invalid URL" });
    }
  });
});

app.get("api/shorturl", function (req, res) {});

app.listen(port, function () {
  console.log("Node.js listening ...");
});
