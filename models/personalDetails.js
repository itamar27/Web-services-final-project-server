const {Schema} = require('mongoose');

const personalDetailsSchema = new Schema({
    id: {type: Number},
    first_name: {type: String},
    last_name: {type: String},
    email: {type: String},
    address: {type: String},
    phone: {type: String},
    linkedin: {type: String},
    facebook: {type: String},
});


module.exports = personalDetailsSchema;
