/* tslint:disable:no-any */
/// <reference path="../../typings/pg/pg.d.ts" />
import pg = require("pg");

interface Queryable {
    query(queryText: string, values: any[], callback: (err: Error, result: pg.QueryResult) => void): void;
}

export = Queryable;
