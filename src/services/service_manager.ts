/* tslint:disable:no-string-literal */
/// <reference path="../../typings/express/express.d.ts" />
/// <reference path="../../typings/passport/passport.d.ts" />
/// <reference path="./strategy_config.ts" />
import Datastore = require("../datastore/datastore");
import express = require("express");
import passport = require("passport");
import Service = require("./service");
import util = require("util");

class ServiceManager {
    private datastore: Datastore;
    private serviceMap: {[name: string]: boolean} = {};

    constructor(datastore: Datastore) {
        this.datastore = datastore;
    }

    private config(service: Service): StrategyConfig {
        var prefix = util.format("%s_CLIENT_", service.name.toUpperCase());
        return {
            clientID: process.env[prefix + "ID"],
            clientSecret: process.env[prefix + "SECRET"],
            callbackURL: process.env[prefix + "CALLBACK"]
        };
    }

    private authUrl(name: string): string {
        return util.format("/auth/%s", name.toLowerCase());
    }

    private callbackUrl(name: string): string {
        return util.format("/auth/%s/callback", name.toLowerCase());
    }

    public registerService(service: Service, authenticates: boolean = false): void {
        this.serviceMap[service.name] = authenticates;
        passport.use(new service.Strategy(this.config(service), service.callback));
    }

    public init(app: express.Application): void {
        passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        passport.deserializeUser((id, done) => {
            this.datastore.getUser(id).nodeify(done);
        });

        app.use(passport.initialize());
        app.use(passport.session());

        Object.keys(this.serviceMap).forEach((key) => {
            if (this.serviceMap[key]) {
                app.get(this.authUrl(key), passport.authenticate(key, {}));
                app.get(this.callbackUrl(key), passport.authenticate(key, {
                    successRedirect: "/winning",
                    failureRedirect: "/losing"
                }));
            } else {
                app.get(this.authUrl(key), passport.authorize(key, {}));
                app.get(this.callbackUrl(key), passport.authorize(key, {
                    successRedirect: "/winning",
                    failureRedirect: "/losing"
                }));
            }
        });
    }
}

export = ServiceManager;
