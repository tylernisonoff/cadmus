// Type definitions for Morgan 1.1.1
// Project: https://github.com/expressjs/morgan
// Definitions by: Phips Peter <http://pspeter3.com>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="../express/express.d.ts" />

declare module "morgan" {
    import express = require("express");

    function morgan(format: string): express.RequestFunction;

    export = morgan;
}