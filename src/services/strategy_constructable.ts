/// <reference path="../../typings/passport/passport.d.ts" />
/// <reference path="./strategy_callback.ts" />
/// <reference path="./strategy_config.ts" />
import passport = require("passport");

interface StrategyConstructable {
    new(config: StrategyConfig, callback?: StrategyCallback): passport.Strategy
}

// #TODO: Interface Friction
// This file has to be exported because TypeScript seems to be doing weird things with interfaces when they import
// other modules.
export = StrategyConstructable;
