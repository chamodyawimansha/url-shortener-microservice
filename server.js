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

const urlSchema = new mongoose.Schema({
  uniqueIdentifier: String,
  url: String,
  shortUrl: String,
});

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", () => {
  return res.json({ error: "Database Error" });
});

const Url = mongoose.model("Url", urlSchema);

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

app.post("/api/shorturl/new", async (req, res) => {
  // get the url from the request
  let parsedUrl = url.parse(req.body.url);

  if (parsedUrl.protocol === null) {
    return res.json({ error: "invalid URL" });
  }

  try {
    let num = await Url.estimatedDocumentCount();

    dns.lookup(parsedUrl.hostname, (error, address) => {
      if (address) {
        const newUrl = new Url({
          uniqueIdentifier: Date.now(),
          url: parsedUrl.href,
          shortUrl: num + 1,
        });

        newUrl.save((error) => {
          if (error) {
            return res.json({ error: "Database Error" });
          } else {
            return res.json({
              original_url: newUrl.url,
              short_url: newUrl.shortUrl,
            });
          }
        });
      } else {
        //send the error message if the url is not correct
        return res.json({ error: "invalid URL" });
      }
    });
  } catch (e) {
    console.log(e);
    return res.json({ error: "Database Error" });
  }
});

app.get("/api/shorturl/:url_id", function (req, res) {
  var id = req.params.url_id;

  Url.findOne({ shortUrl: id }, function (err, result) {
    if (err) return console.error(err);

    if (result) {
      res.redirect(result.url);
    } else {
      res.redirect("/");
    }
  });
});

app.listen(port, function () {
  console.log("Node.js listening ...");
});
