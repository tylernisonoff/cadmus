// Type definitions for Passport Asana 0.0.1
// Project: https://github.com/nickls/passport-asana
// Definitions by: Phips Peter <http://pspeter3.com>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="../passport/passport.d.ts" />

declare module "passport-asana" {
    import express = require('express');
    import passport = require("passport");

    export interface AsanaProfile {
        provider: string;
        id: string;
        displayName: string;
        emails: {value: string}[];
        _raw: string;
        _json: Object;
    }

    export interface AsanaStrategyConfig {
        clientID: string;
        clientSecret: string;
        callbackURL: string;
    }

    export class Strategy implements passport.Strategy {
        constructor(config: AsanaStrategyConfig, callback: (
            accessToken: string,
            refreshToken: string,
            profile: AsanaProfile,
            done: (err: Error, user: Object) => void) => void);

        authenticate(req: express.Request, options?: Object): void;
    }
}