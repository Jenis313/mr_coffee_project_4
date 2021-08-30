const dbConfig = require('./configs/db.config');
const mongoose = require('mongoose');
const connectionURL = dbConfig.connectionURL + '/' + dbConfig.dbName;

mongoose.connect(connectionURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, (err, result) => {
    if(err){
        console.log('Error in db conncetion');
        return;
    }
    console.log('DB connection successful')
})