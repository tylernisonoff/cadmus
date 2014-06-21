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

        it("should release the client if there is an error", () => {
            var databaseUrl = "postgres://localhost/cadmus";
            var released = false;
            var connect = (connection: string, callback: (err: Error, client: pg.Client, done: () => void) => void) => {
                callback(new Error("Failed!!!"), null, () => {
                    released = true;
                });
            };
            var datastore = new Datastore(databaseUrl, connect);
            var assertReleased = () => {
                assert(released);
            };
            return datastore.query("foobar", []).then(assertReleased, assertReleased);
        });
    });
});
