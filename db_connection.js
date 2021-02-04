const mongoose = require('mongoose');
const { DB_HOST, DB_USER, DB_PASS } = require('./constants');

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    user: DB_USER,
    pass: DB_PASS
};

mongoose
    .connect(DB_HOST, options)
    .then(() => console.log('connected to DB'))
    .catch(err => console.log(`connection error: ${err}`));

module.exports = mongoose