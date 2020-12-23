const {Schema} = require('mongoose');

const addressSchema = new Schema({
    country: {type: String},
    city: {type: String},
    home_number: {type: String}
});

const socialMediaSchema = new Schema({
    github: {type: String},
    linkedin: {type: String},
    facebook: {type: String},
    instagram: {type: String},
});

const personalDetailsSchema = new Schema({
    id: {type: Number},
    first_name: {type: String},
    last_name: {type: String},
    email: {type: String},
    address: {type: addressSchema},
    phone: {type: String},
    social_media: {type: socialMediaSchema},
});


module.exports = personalDetailsSchema;
