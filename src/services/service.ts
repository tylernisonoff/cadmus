/// <reference path="../../typings/passport/passport.d.ts" />
/// <reference path="./profile.ts" />
import passport = require("passport");

interface Service {
    name: string;
    strategy: passport.Strategy;
    callback: (
        accessToken: string,
        refeshToken: string,
        profile: Profile,
        done: (err: Error, profile: Profile) => void) => void;
}

// #TODO: Interface Friction
// This file has to be exported because TypeScript seems to be doing weird things with interfaces when they import
// other modules.
export = Service;