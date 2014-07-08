import StrategyConstructable = require("./strategy_constructable");

interface Service {
    name: string;
    Strategy: StrategyConstructable;
    authenticates?: boolean;
}

export = Service;
