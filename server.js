import express from "express";
import { lookup } from "dns";
import { parse } from "url";
import { Database } from "./Database.js";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import pkg from "body-parser";
require("dotenv").config();

var app = express();

// Basic Configuration
const port = process.env.PORT;

app.use(cors());

/** this project needs to parse POST bodies **/

app.use(json()); // to support JSON-encoded bodies
app.use(
  urlencoded({
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
  let parsedUrl = parse(req.body.url);

  if (parsedUrl.protocol === null) {
    return res.json({ error: "invalid URL" });
  }

  lookup(parsedUrl.hostname, (error, address) => {
    if (address) {
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
