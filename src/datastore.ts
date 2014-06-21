/// <reference path="../typings/bluebird/bluebird.d.ts" />
/// <reference path="../typings/pg/pg.d.ts" />
import pg = require("pg");
import Promise = require("bluebird");
import User = require("./models/user");

class Datastore {
    private databaseUrl: string;
    private connect: (connection: string, callback: (err: Error, client: pg.Client, done: () => void) => void) => void;

    constructor(
        databaseUrl: string,
        connect: (connection: string, callback: (err: Error, client: pg.Client, done: () => void) => void) => void) {
        this.databaseUrl = databaseUrl;
        this.connect = connect;
    }

    private query(queryText: string, values: any[]): Promise<pg.QueryResult> {
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

    private wrap<T>(value: T): Promise<T> {
        return new Promise((resolve: (value: T) => void, reject: (err: Error) => void) => {
           return resolve(value);
        });
    }

    public getOrCreateUser(id: number, name: string): Promise<User> {
        return this.query("SELECT * FROM users WHERE id = $1;", [id]).then((result) => {
            if (result.rows.length === 1) {
                return this.wrap(<User>result.rows[0]);
            }
            return this.query("INSERT INTO users(id, name) VALUES ($1, $2);", [id, name]).then((result) => {
                return {
                    id: id,
                    name: name
                };
            });
        });
    }
}

export = Datastore;
