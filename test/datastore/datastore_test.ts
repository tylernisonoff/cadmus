/* tslint:disable:no-any */
/// <reference path="../../src/models/credentials.ts"/>
/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/pg/pg.d.ts" />
/// <reference path="../../src/models/user.ts"/>
import assert = require("assert");
import Datastore = require("../../src/datastore/datastore");
import pg = require("pg");
import queries = require("../../src/datastore/queries");
import Queryable = require("../../src/datastore/queryable");

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

interface MultipleQueriesDatastore {
    datastore: Datastore;
    assertLength: (length?: number) => void;
}

var createDatastoreWithMultipleQueries = (
    queries: string[],
    values: any[][],
    errs: Error[],
    results: pg.QueryResult[]): MultipleQueriesDatastore => {
    var connect = (connection: string, callback: (err: Error, client: Queryable, done: () => void) => void) => {
        var query = queries.shift();
        var params = values.shift();
        var err = errs.shift();
        var result = results.shift();
        var mockClient = new MockPgClient(query, params, err, result);
        callback(null, mockClient, () => {
            return;
        });
    };
    return {
        datastore: new Datastore(DATABASE_URL, connect),
        assertLength: (length?: number) => {
            if (!length) {
                length = 0;
            }
            assert.equal(queries.length, length);
            assert.equal(values.length, length);
            assert.equal(errs.length, length);
            assert.equal(results.length, length);
        }
    };
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

    describe("#getOrCreateUser", () => {
        it("should not create a user if one is found", () => {
            var user = {
                id: 1,
                name: "Sushi"
            };
            var context = createDatastoreWithMultipleQueries(
                [queries.FIND_USER],
                [
                    [user.id]
                ],
                [null],
                [
                    {rows: [user]}
                ]
            );
            return context.datastore.getOrCreateUser(user.id, user.name).then((value) => {
                assert.deepEqual(user, value);
                context.assertLength();
            });
        });

        it("should create a user if one is not found", () => {
            var user = {
                id: 1,
                name: "Sushi"
            };
            var context = createDatastoreWithMultipleQueries(
                [queries.FIND_USER, queries.INSERT_USER],
                [
                    [user.id],
                    [user.id, user.name]
                ],
                [null, null],
                [
                    {rows: []},
                    {rows: [user]}
                ]
            );
            return context.datastore.getOrCreateUser(user.id, user.name).then((value) => {
                assert.deepEqual(user, value);
                context.assertLength();
            });
        });

        it("should not create a user if there is an error", () => {
            var user = {
                id: 1,
                name: "Sushi"
            };
            var error = new Error("fail");
            var context = createDatastoreWithMultipleQueries(
                [queries.FIND_USER, queries.INSERT_USER],
                [
                    [user.id],
                    [user.id, user.name]
                ],
                [error, null],
                [
                    {rows: []},
                    {rows: [user]}
                ]
            );
            var success = () => {
                assert(false, "We should never have gotten here");
            };
            var fail = (err: Error) => {
                context.assertLength(1);
                if (err !== error) {
                    throw err;
                }
            };
            return context.datastore.getOrCreateUser(user.id, user.name).then(success, fail);
        });
    });

    describe("#getCredentials", () => {
        it("should return a credentials", () => {
            var service = "Asana";
            var userId = 1;
            var credentials = {
                id: "1",
                service: service,
                serviceId: "1",
                accessToken: "1",
                refreshToken: "1",
                userId: userId
            };
            var values = [service, userId];
            var err: Error = null;
            var results = {
                rows: [credentials]
            };
            var datastore = createDatastore(queries.FIND_CREDENTIALS, values, err, results);
            return datastore.getCredentials(service, userId).then((value) => {
                assert.deepEqual(value, credentials);
            });
        });

        it("should reject the promise if there are no results", () => {
            var service = "Asana";
            var userId = 1;

            var values = [service, userId];
            var err: Error = null;
            var results = {
                rows: []
            };
            var datastore = createDatastore(queries.FIND_CREDENTIALS, values, err, results);
            var success = (value: Credentials) => {
                assert(false, "This should never be called");
            };
            var fail = (e: Error) => {
                assert(true, "This is the correct code path");
            };
            return datastore.getCredentials(service, userId).then(success, fail);
        });
    });

    describe("#getOrCreateCredentials", () => {
        it("should not create credentials if one is found", () => {
            var credentials = {
                id: "1",
                service: "Asana",
                serviceId: "1",
                accessToken: "1",
                refreshToken: "1",
                userId: 1
            };
            var context = createDatastoreWithMultipleQueries(
                [queries.FIND_CREDENTIALS],
                [
                    [credentials.service, credentials.userId]
                ],
                [null],
                [
                    {rows: [credentials]}
                ]
            );
            return context.datastore.getOrCreateCredentials(
                credentials.service,
                credentials.serviceId,
                credentials.accessToken,
                credentials.refreshToken,
                credentials.userId).then((value) => {
                    assert.deepEqual(credentials, value);
                    context.assertLength();
                });
        });

        it("should create credentials if one is not found", () => {
            var credentials = {
                id: "1",
                service: "Asana",
                serviceId: "1",
                accessToken: "1",
                refreshToken: "1",
                userId: 1
            };
            var context = createDatastoreWithMultipleQueries(
                [queries.FIND_CREDENTIALS, queries.INSERT_CREDENTIALS],
                [
                    [credentials.service, credentials.userId],
                    [credentials.service,
                        credentials.serviceId,
                        credentials.accessToken,
                        credentials.refreshToken,
                        credentials.userId]
                ],
                [null, null],
                [
                    {rows: []},
                    {rows: [credentials]}
                ]
            );
            return context.datastore.getOrCreateCredentials(
                credentials.service,
                credentials.serviceId,
                credentials.accessToken,
                credentials.refreshToken,
                credentials.userId).then((value) => {
                    assert.deepEqual(credentials, value);
                    context.assertLength();
                });
        });

        it("should not create credentials if there is an error", () => {
            var credentials = {
                id: "1",
                service: "Asana",
                serviceId: "1",
                accessToken: "1",
                refreshToken: "1",
                userId: 1
            };
            var error = new Error("fail");
            var context = createDatastoreWithMultipleQueries(
                [queries.FIND_CREDENTIALS, queries.INSERT_CREDENTIALS],
                [
                    [credentials.service, credentials.userId],
                    [credentials.service,
                        credentials.serviceId,
                        credentials.accessToken,
                        credentials.refreshToken,
                        credentials.userId]
                ],
                [error, null],
                [
                    {rows: []},
                    {rows: [credentials]}
                ]
            );
            var success = () => {
                assert(false, "We should never have gotten here");
            };
            var fail = (err: Error) => {
                context.assertLength(1);
                if (err !== error) {
                    throw err;
                }
            };
            return context.datastore.getOrCreateCredentials(
                credentials.service,
                credentials.serviceId,
                credentials.accessToken,
                credentials.refreshToken,
                credentials.userId).then(success, fail);
        });
    });
});
