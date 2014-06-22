/* tslint:disable:no-any */
/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/pg/pg.d.ts" />
import assert = require("assert");
import Datastore = require("../../src/datastore/datastore");
import pg = require("pg");
import queries = require("../../src/datastore/queries");
import Queryable = require("../../src/datastore/queryable");
import User = require("../../src/models/user");

class MockPgClient implements Queryable {
    private queryText: string;
    private values: any[];
    private err: Error;
    private result: pg.QueryResult;

    constructor(queryText: string, values: any[], err: Error, result: pg.QueryResult) {
        this.queryText = queryText;
        this.values = values;
        this.err = err;
        this.result = result;
    }

    public query(queryText: string, values: any[], callback: (err: Error, result: pg.QueryResult) => void): void {
        assert.equal(this.queryText, queryText);
        assert.deepEqual(this.values, values);
        callback(this.err, this.result);
    }
}

var DATABASE_URL = "postgres://localhost/cadmus";

var createDatastore = (queryText: string, values: any[], err: Error, result: pg.QueryResult): Datastore => {
    var connect = (connection: string, callback: (err: Error, client: Queryable, done: () => void) => void) => {
        var mockClient = new MockPgClient(queryText, values, err, result);
        callback(null, mockClient, () => {
            return;
        });
    };
    return new Datastore(DATABASE_URL, connect);
};

describe("Datastore", () => {
    describe("#query", () => {
        it("should create a connection", (done) => {
            var connect = (connection: string, callback: (err: Error, client: Queryable, done: () => void) => void) => {
                assert.equal(connection, DATABASE_URL);
                done();
            };
            var datastore = new Datastore(DATABASE_URL, connect);
            datastore.query("foobar", []);
        });

        it("should release the client if there is an error", () => {
            var released = false;
            var connect = (connection: string, callback: (err: Error, client: Queryable, done: () => void) => void) => {
                callback(new Error("Failed!!!"), null, () => {
                    released = true;
                });
            };
            var datastore = new Datastore(DATABASE_URL, connect);
            var assertReleased = () => {
                assert(released);
            };
            return datastore.query("foobar", []).then(assertReleased, assertReleased);
        });

        it("should pass the query text and values to the client", () => {
            var id = [1];
            var datastore = createDatastore(queries.FIND_USER, id, null, {rows: []});
            return datastore.query(queries.FIND_USER, id);
        });

        it("should reject the promise if there is an error", () => {
            var values = [1];
            var err = new Error("Rejected");
            var results = {
                rows: []
            };
            var datastore = createDatastore(queries.FIND_USER, values, err, results);
            var success = (value: pg.QueryResult) => {
                assert(false, "This should never be called");
            };
            var fail = (e: Error) => {
                assert.deepEqual(e, err);
            };
            return datastore.query(queries.FIND_USER, values).then(success, fail);
        });

        it("should pass the result as the value", () => {
            var values = [1];
            var err: Error = null;
            var results = {
                rows: [
                    {id: 1}
                ]
            };
            var datastore = createDatastore(queries.FIND_USER, values, err, results);
            var success = (value: pg.QueryResult) => {
                assert.deepEqual(results, value);
            };
            var fail = (err: Error) => {
                assert(false, "This should never be called");
            };
            return datastore.query(queries.FIND_USER, values).then(success, fail);
        });
    });

    describe("#getUser", () => {
        it("should return a user", () => {
            var id = 1;
            var user = {
                id: id,
                name: "Sushi"
            };
            var values = [id];
            var err: Error = null;
            var results = {
                rows: [user]
            };
            var datastore = createDatastore(queries.FIND_USER, values, err, results);
            return datastore.getUser(id).then((value) => {
                assert.deepEqual(value, user);
            });
        });

        it("should reject the promise if there are no results", () => {
            var id = 1;
            var values = [id];
            var err: Error = null;
            var results = {
                rows: []
            };
            var datastore = createDatastore(queries.FIND_USER, values, err, results);
            var success = (value: User) => {
                assert(false, "This should never be called");
            };
            var fail = (e: Error) => {
                assert(true, "This is the correct code path");
            };
            return datastore.getUser(id).then(success, fail);
        });
    });
});
