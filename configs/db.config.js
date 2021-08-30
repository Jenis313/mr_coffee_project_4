const mongodb = require('mongodb');
const connectionURL = 'mongodb://localhost:27017';
const dbName = 'mr_coffee_db';

module.exports = {
    connectionURL,
    dbName,
    QID: mongodb.ObjectID
}