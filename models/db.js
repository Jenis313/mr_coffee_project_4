// Loading and initializing the library:
const pgp = require('pg-promise')();
const { user,
    password,
    host,
    port,
    dbName } = require('./../configs/db.config');

// Preparing the connection details:
const ConnectionURL = `postgres://${user}:${password}@${host}:${port}/${dbName}`;

// Creating a new database instance from the connection details:
const db = pgp(ConnectionURL);

// Exporting the database object for shared use:
module.exports = db;