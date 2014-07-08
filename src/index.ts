/// <reference path="../typings/cookie-parser/cookie-parser.d.ts" />
/// <reference path="../typings/express/express.d.ts" />
/// <reference path="../typings/express-session/express-session.d.ts" />
/// <reference path="../typings/morgan/morgan.d.ts" />
import asana = require("./services/asana");
import config = require("./config");
import connect = require("./datastore/connect");
import cookieParser = require("cookie-parser");
import Datastore = require("./datastore/datastore");
import express = require("express");
import facebook = require("./services/facebook");
import morgan = require("morgan");
import ServiceManager = require("./services/service_manager");
import session = require("express-session");

var app = express();

var datastore = new Datastore(config.DATABASE_URL, connect);

var serviceManager = new ServiceManager(datastore);

serviceManager.registerService(asana);
serviceManager.registerService(facebook);

app.use(cookieParser());
app.use(morgan("dev"));
app.use(session({
    secret: config.SECRET
}));
serviceManager.init(app);

app.get("/winning", (req, res) => {
    res.send("So shines a good deed in a weary world.");
});

app.get("/losing", (req, res) => {
    res.send("You lose! Good day, sir!");
});

app.listen(config.PORT, () => {
   console.log("Welcome Cadmus!");
});
