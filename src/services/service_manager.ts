/* tslint:disable:no-string-literal */
/// <reference path="../../typings/express/express.d.ts" />
/// <reference path="../../typings/passport/passport.d.ts" />
/// <reference path="./profile.ts" />
/// <reference path="./strategy_config.ts" />
import Datastore = require("../datastore/datastore");
import express = require("express");
import passport = require("passport");
import StrategyConstructable = require("./strategy_constructable");
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

    public registerService(name: string, Strategy: StrategyConstructable, authenticates: boolean = false): void {
        this.serviceMap[name] = authenticates;
        var config = this.config(name);
        var strategy: passport.Strategy;
        if (authenticates) {
            var callback = (
                accessToken: string,
                refreshToken: string,
                profile: Profile,
                done: (err: Error, profile: Profile) => void) => {
                var id = parseInt(profile.id, 10);
                return this.datastore.getOrCreateUser(id, profile.displayName).then((user) => {
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
            strategy = new Strategy(config, callback);
        } else {
            strategy = new Strategy(config);
        }
        passport.use(strategy);
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
                    var user = req.user;
                    var account = req.account;
                    return res.json({
                        user: user,
                        account: account
                    });
                });
            }
        });
    }
}

export = ServiceManager;
