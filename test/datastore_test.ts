/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/pg/pg.d.ts" />
import assert = require("assert");
import Datastore = require("../src/datastore");
import pg = require("pg");

describe("Datastore", () => {
    describe("#query", () => {
        it("should create a connection", (done) => {
            var databaseUrl = "postgres://localhost/cadmus";
            var connect = (connection: string, callback: (err: Error, client: pg.Client, done: () => void) => void) => {
                assert.equal(connection, databaseUrl);
                done();
            };
            var datastore = new Datastore(databaseUrl, connect);
            datastore.query("foobar", []);
        });
    });
});
