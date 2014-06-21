/// <reference path="../typings/pg/pg.d.ts" />
import pg = require("pg");

var connect = (connection: string, callback: (err: Error, client: pg.Client, done: () => void) => void): void => {
    pg.connect(connection, callback);
};

export = connect;
