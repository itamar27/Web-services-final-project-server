const {Schema, model} = require('mongoose');
const personalDetails = require('./personalDetails')

const customerSchema = new Schema({
    personal_details: {type: personalDetails},
    jobs_id: [{type: Number}]
}, {collection: 'customers'});

const customer = model('customer', customerSchema);

module.exports = customer;
