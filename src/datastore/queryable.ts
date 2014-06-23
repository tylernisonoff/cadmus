/* tslint:disable:no-any */
/// <reference path="../../typings/pg/pg.d.ts" />
import pg = require("pg");

interface Queryable {
    query(queryText: string, values: any[], callback: (err: Error, result: pg.QueryResult) => void): void;
}

// #TODO: Interface Friction
// This file has to be exported because TypeScript seems to be doing weird things with interfaces when they import
// other modules.
export = Queryable;
