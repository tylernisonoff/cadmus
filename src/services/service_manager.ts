/* tslint:disable:no-string-literal */
/// <reference path="../../typings/passport/passport.d.ts" />
/// <reference path="./strategy_config.ts" />
import Datastore = require("../datastore/datastore");
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

    public registerService(service: Service, authenticates: boolean = false): void {
        this.serviceMap[service.name] = authenticates;
        passport.use(new service.Strategy(this.config(service), service.callback));
    }
}

export = ServiceManager;
