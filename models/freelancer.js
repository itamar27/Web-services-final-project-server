const { Schema, model } = require('mongoose');
const personalDetails = require('./personalDetails')

const skillsSchema = new Schema({
    work_experience: { type: Number },
    work_history: { type: String },
    programming_languages: [{ type: String }],
    work_fields: [{ type: String }]
})

const freelancerSchema = new Schema({
    personal_details: { type: personalDetails },
    description: { type: String },
    skills: { type: skillsSchema },
    jobs_id: [{ type: Number }]
}, { collection: 'freelancers' });

const Freelancer = model('freelancer', freelancerSchema);

module.exports = Freelancer;

