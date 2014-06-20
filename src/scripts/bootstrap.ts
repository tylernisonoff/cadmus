/// <reference path="../../typings/bluebird/bluebird.d.ts" />
/// <reference path="../../typings/pg/pg.d.ts" />
import config = require("../config");
import fs = require("fs");
import pg = require("pg");
import Promise = require("bluebird");

var schemaFile = process.argv[2];

var readSchemaFile = new Promise((resolve: (value: string) => void, reject: (reason: Error) => void) => {
    fs.readFile(schemaFile, {
        encoding: "utf8"
    }, (err, contents) => {
        if (err) {
            return reject(err);
        }
        return resolve(contents);
    });
});

var createSchema = readSchemaFile.then((schema: string) => {
    var client = new pg.Client(config.DATABASE_URL);
    return new Promise((resolve: (value: pg.QueryResult) => void, reject: (reason: Error) => void) => {
        client.query(schema, (err, result) => {
            console.log(err, result);
            client.end();
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
});

createSchema.then(console.log, console.error);
