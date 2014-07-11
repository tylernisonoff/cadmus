/* tslint:disable:no-string-literal */
/// <reference path="../../typings/express/express.d.ts" />
/// <reference path="../../typings/passport/passport.d.ts" />
import Datastore = require("../datastore/datastore");
import express = require("express");
import passport = require("passport");
import Profile = require("./profile");
import Service = require("./service");
import StrategyConfig = require("./strategy_config");
import User = require("../models/user");
import util = require("util");

interface RequestWithAccount extends express.Request {
    account: Object;
}

class ServiceManager {
    private datastore: Datastore;
    private serviceMap: {[name: string]: boolean} = {};

    constructor(datastore: Datastore) {
        this.datastore = datastore;
    }

    private config(name: string): StrategyConfig {
        var prefix = util.format("%s_CLIENT_", name.toUpperCase());
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

    public registerService(service: Service): void {
        var authenticates = false;
        if (service.authenticates) {
            authenticates = true;
        }
        this.serviceMap[service.name] = authenticates;
        var callback = (
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: (err: Error, profile: Profile) => void) => {
            done(null, profile);
        };
        if (authenticates) {
            callback = (
                accessToken: string,
                refreshToken: string,
                profile: Profile,
                done: (err: Error, profile: Profile) => void) => {
                var id = parseInt(profile.id, 10);
                this.datastore.getOrCreateUser(id, profile.displayName).then((user) => {
                    return this.datastore.getOrCreateCredentials(
                        profile.provider,
                        profile.id,
                        accessToken,
                        refreshToken,
                        id).then((credentials) => {
                            return user;
                        });
                }).nodeify(done);
            };
        }
        passport.use(new service.Strategy(this.config(service.name), callback));
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
                app.get(this.authUrl(key), passport.authorize(key, {
                    failureRedirect: "/losing"
                }));
                app.get(this.callbackUrl(key), passport.authorize(key, {
                    failureRedirect: "/losing"
                }), (req: RequestWithAccount, res: express.Response) => {
                    // If cookie is deleted and req.user exists, use that
                    var user = <User>req.user || <User>req.cookies.user;
                    var account = <Profile>req.account;
                    this.datastore.getOrCreateCredentials(
                        account.provider,
                        account.id,
                        req.query.code,
                        "",
                        user.id
                    ).then((credentials) => {
                            res.json(credentials);
                    }).catch((err) => {
                            console.error(err);
                            res.send(500);
                    });
                });
            }
        });
    }
}

export = ServiceManager;
