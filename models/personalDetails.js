const { Schema } = require('mongoose');

const personalDetailsSchema = new Schema({
    id: { type: Number },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    linkedin: { type: String },
    facebook: { type: String },
});


module.exports = personalDetailsSchema;