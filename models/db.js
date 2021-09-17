// Loading and initializing the library:
const pgp = require('pg-promise')();

// Preparing the connection details:
const ConnectionURL = 'postgres://postgres:admin@localhost:5432/mr_coffee_db_4';

// Creating a new database instance from the connection details:
const db = pgp(ConnectionURL);

// Exporting the database object for shared use:
module.exports = db;