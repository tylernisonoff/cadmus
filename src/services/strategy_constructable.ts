/// <reference path="../../typings/passport/passport.d.ts" />
import passport = require("passport");
import StrategyCallback = require("./strategy_callback");
import StrategyConfig = require("./strategy_config");

interface StrategyConstructable {
    new(config: StrategyConfig, callback?: StrategyCallback): passport.Strategy
}

export = StrategyConstructable;
