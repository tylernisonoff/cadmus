/// <reference path="./strategy_callback.ts" />
import Strategy = require("./strategy");

interface Service {
    name: string;
    Strategy: Strategy;
    callback: StrategyCallback;
}

export = Service;
