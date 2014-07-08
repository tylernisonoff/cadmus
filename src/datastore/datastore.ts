/* tslint:disable:no-any */
/// <reference path="../../typings/bluebird/bluebird.d.ts" />
/// <reference path="../../typings/pg/pg.d.ts" />
import Credentials = require("../models/credentials");
import pg = require("pg");
import Promise = require("bluebird");
import queries = require("./queries");
import Queryable = require("./queryable");
import RecordNotFoundError = require("./record_not_found_error");
import User = require("../models/user");

class Datastore {
    private databaseUrl: string;
    private connect: (connection: string, callback: (err: Error, client: Queryable, done: () => void) => void) => void;

    constructor(databaseUrl: string,
                connect: (
                    connection: string,
                    callback: (err: Error, client: Queryable, done: () => void) => void) => void) {
        this.databaseUrl = databaseUrl;
        this.connect = connect;
    }

    public query(queryText: string, values: any[]): Promise<pg.QueryResult> {
        return new Promise((resolve: (value: pg.QueryResult) => void, reject: (err: Error) => void) => {
            this.connect(this.databaseUrl, (err, client, release) => {
                if (err) {
                    release();
                    return reject(err);
                }
                client.query(queryText, values, (err, result) => {
                    release();
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                });
            });
        });
    }

    public getUser(id: number): Promise<User> {
        return this.query(queries.FIND_USER, [id]).then((result) => {
            if (result.rows.length !== 1) {
                throw new RecordNotFoundError("User[" + id + "] not found");
            }
            return <User>result.rows[0];
        });
    }

    public getOrCreateUser(id: number, name: string): Promise<User> {
        return this.getUser(id).catch((err) => {
            if (!(err instanceof RecordNotFoundError)) {
                throw err;
            }
            return this.query(queries.INSERT_USER, [id, name]).then((result) => {
                return {
                    id: id,
                    name: name
                };
            });
        });
    }

    public getCredentials(service: string, usedId: number) {
        return this.query(queries.FIND_CREDENTIALS, [service, usedId]).then((result) => {
            if (result.rows.length !== 1) {
                throw new RecordNotFoundError("Credentials for [" + service + ", " + usedId + "] not found");
            }
            return <Credentials>result.rows[0];
        });
    }

    public getOrCreateCredentials(
        service: string,
        serviceId: string,
        accessToken: string,
        refreshToken: string,
        userId: number): Promise<Credentials> {
        return this.getCredentials(service, userId).catch((err) => {
            if (!(err instanceof RecordNotFoundError)) {
                throw err;
            }
            return this.query(queries.INSERT_CREDENTIALS,
                [service, serviceId, accessToken, refreshToken, userId]).then((result) => {
                    return {
                        id: result.rows[0].id,
                        service: service,
                        serviceId: serviceId,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        userId: userId
                    };
                });
        });
    }
}

export = Datastore;
