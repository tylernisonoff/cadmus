/// <reference path="../../typings/pg/pg.d.ts" />
import Queryable = require("./queryable");
import pg = require("pg");

var connect = (connection: string, callback: (err: Error, client: Queryable, done: () => void) => void): void => {
    pg.connect(connection, callback);
};

export = connect;
