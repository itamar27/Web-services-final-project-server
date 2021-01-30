const { Schema, model } = require('mongoose');
const personalDetails = require('./personalDetails')

const customerSchema = new Schema({
    personal_details: { type: personalDetails },
    freelancer_api_id: { type: Number },
    freelancer_api_username: { type: String },
    jobs_id: [{ type: Number }],
    job_offers: [{ type: Object }]

}, { collection: 'customers' });

const customer = model('customer', customerSchema);

module.exports = customer;