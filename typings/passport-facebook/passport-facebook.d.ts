// Type definitions for Passport Facebook 1.0.3
// Project: https://github.com/jaredhanson/passport-facebook
// Definitions by: Phips Peter <http://pspeter3.com>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="../passport/passport.d.ts" />

declare module "passport-facebook" {
    import express = require('express');
    import passport = require("passport");

    export interface FacebookProfile {
        provider: string;
        id: string;
        displayName: string;
        emails: {value: string}[];
        _raw: string;
        _json: Object;
    }

    export interface FacebookStrategyConfig {
        clientID: string;
        clientSecret: string;
        callbackURL: string;
    }

    export class Strategy implements passport.Strategy {
        constructor(config: FacebookStrategyConfig, callback: (
            accessToken: string,
            refreshToken: string,
            profile: FacebookProfile,
            done: (err: Error, user: Object) => void) => void);

        authenticate(req: express.Request, options?: Object): void;
    }
}