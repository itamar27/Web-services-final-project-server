const { Schema, model } = require('mongoose');
const personalDetails = require('./personalDetails')

const skillsSchema = new Schema({
    work_experience: { type: Number },
    work_history: { type: String },
    programming_languages: [{ type: String, required: true }],
    work_fields: [{ type: String, required: true }]
})

const freelancerSchema = new Schema({
    personal_details: { type: personalDetails, required: true },
    description: { type: String },
    skills: { type: skillsSchema, required: true },
    jobs_id: [{ type: Number }]
}, { collection: 'freelancers' });

const freelancer = model('freelancer', freelancerSchema);

module.exports = freelancer;