/// <reference path="../../typings/pg/pg.d.ts" />
import pg = require("pg");
import Queryable = require("./queryable");

var connect = (connection: string, callback: (err: Error, client: Queryable, done: () => void) => void): void => {
    pg.connect(connection, callback);
};

export = connect;
