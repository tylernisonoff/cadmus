/// <reference path="../typings/express/express.d.ts" />
import asana = require("./services/asana");
import config = require("./config");
import connect = require("./datastore/connect");
import Datastore = require("./datastore/datastore");
import express = require("express");
import facebook = require("./services/facebook");
import ServiceManager = require("./services/service_manager");

var app = express();

var datastore = new Datastore(config.DATABASE_URL, connect);

var serviceManager = new ServiceManager(datastore);

serviceManager.registerService(asana.name, asana.Strategy, true);
serviceManager.registerService(facebook.name, facebook.Strategy);

serviceManager.init(app);

app.get("/winning", (req, res) => {
    res.send("So shines a good deed in a weary world.");
});

app.get("/losing", (req, res) => {
    res.send("You lose! Good day, sir!");
});

app.listen(3000, () => {
   console.log("Welcome Cadmus!");
});
