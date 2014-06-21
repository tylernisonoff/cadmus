/// <reference path="../typings/express/express.d.ts" />
/// <reference path="../typings/passport/passport.d.ts" />
/// <reference path="../typings/passport-asana/passport-asana.d.ts" />
/// <reference path="../typings/pg/pg.d.ts" />
import config = require("./config");
import Datastore = require("./datastore");
import express = require("express");
import passport = require("passport");
import passportAsana = require("passport-asana");
import pg = require("pg");

var app = express();

console.log(config);

var connect = (connection: string, callback: (err: Error, client: pg.Client, done: () => void) => void): void => {
    pg.connect(connection, callback);
};

var datastore = new Datastore(config.DATABASE_URL, connect);

interface Profile {
    id: number;
    displayName: string;
}

passport.use(new passportAsana.Strategy(config.ASANA_STRATEGY, (accessToken: string, refreshToken: string, profile: Profile, done: (err: Error, profile: Profile) => void) => {
    return datastore.getOrCreateUser(profile.id, profile.displayName).nodeify(done);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
   done(null, id);
});

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
