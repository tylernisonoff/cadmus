// Type definitions for Cookie Parser 1.3.1
// Project: https://github.com/expressjs/cookie-parser
// Definitions by: Phips Peter <http://pspeter3.com>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="../express/express.d.ts" />

declare module "cookie-parser" {
    import express = require("express");

    function cookieParser(secret?: string, options?: Object): express.RequestFunction;

    export = cookieParser;
}