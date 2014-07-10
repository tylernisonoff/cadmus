/// <reference path="../../typings/pg/pg.d.ts" />
import Account = require("./account");
import Promise = require("bluebird");
import StrategyConstructable = require("./strategy_constructable");

interface Service {
    name: string;
    Strategy: StrategyConstructable;
    authenticates?: boolean;
    connections?(accessToken: string): Promise<Account>;
}

export = Service;
