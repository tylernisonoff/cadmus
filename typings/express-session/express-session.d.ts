// Type definitions for Express Session 1.5.1
// Project: https://github.com/expressjs/session
// Definitions by: Phips Peter <http://pspeter3.com>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="../express/express.d.ts" />

declare module "express-session" {
    import express = require("express");

    function session(options: Object): express.RequestFunction;

    export = session;
}