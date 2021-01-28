const { Schema, model } = require('mongoose');
const personalDetails = require('./personalDetails')

const customerSchema = new Schema({
    personal_details: { type: personalDetails },
    freelancer_api_id: { type: Number },
    freelancer_api_username: { type: String, required: true },
    jobs_id: [{ type: Number }]
}, { collection: 'customers' });

const customer = model('customer', customerSchema);

module.exports = customer;