/// <reference path="../typings/express/express.d.ts" />
/// <reference path="../typings/passport/passport.d.ts" />
/// <reference path="../typings/passport-asana/passport-asana.d.ts" />
import config = require("./config");
import express = require("express");
import passport = require("passport");
import passportAsana = require("passport-asana");

var app = express();

console.log(config);

passport.use(new passportAsana.Strategy(config.ASANA_STRATEGY, (accessToken, refreshToken, profile, done) => {
    console.log(accessToken, refreshToken, profile);
    done(null, profile);
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/asana", passport.authenticate("Asana", {}));
app.get("/auth/asana/callback", passport.authenticate("Asana", {
    successRedirect: "/winning",
    failureRedirect: "/losing"
}));

app.get("/winning", (req, res) => {
    res.send("So shines a good deed in a weary world.");
});

app.get("/losing", (req, res) => {
    res.send("You lose! Good day, sir!");
});

app.listen(3000, () => {
   console.log("Welcome Cadmus!");
});
