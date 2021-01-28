const { Schema, model } = require('mongoose');

const goalSchema = new Schema({
    phase: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String },
    meaningful: { type: Boolean },
    comments: { type: String, default: null },
    progress: { type: Number, default: 0 }
});

const jobSchema = new Schema({
    id: { type: Number },
    project_name: { type: String, required: true },
    price: { type: String },
    customer_id: { type: Number },
    start_date: { type: Date },
    deadline: { type: Date, required: true },
    goals: [{ type: goalSchema }],
}, { collection: 'jobs' });


const job = model('job', jobSchema);
module.exports = job;