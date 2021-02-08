const { Schema, model } = require('mongoose');

const Comment = new Schema({
    name: { type: String },
    time: { type: String },
    comment: { type: String },
})

const goalSchema = new Schema({
    phase: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    meaningful: { type: Boolean },
    comments: [{ type: Comment }],
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