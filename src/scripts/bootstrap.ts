/// <reference path="../../typings/bluebird/bluebird.d.ts" />
import config = require("../config");
import connect = require("../datastore/connect");
import Datastore = require("../datastore/datastore");
import fs = require("fs");
import Promise = require("bluebird");

var schemaFile = process.argv[2];

var datastore = new Datastore(config.DATABASE_URL, connect);

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
    return datastore.query(schema, []);
});

createSchema.then(console.log, console.error);
