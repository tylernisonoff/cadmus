/// <reference path="../typings/express/express.d.ts" />
import express = require("express");

var app = express();

app.get("/", (req, res) => {
   res.json({
       "ok": true
   });
});

app.listen(3000, () => {
   console.log("Welcome Cadmus!");
});
