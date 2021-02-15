const { Schema } = require('mongoose');

const personalDetailsSchema = new Schema({
    id: { type: Number },
    google_id: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    linkedin: { type: String },
    facebook: { type: String },

});


module.exports = personalDetailsSchema;