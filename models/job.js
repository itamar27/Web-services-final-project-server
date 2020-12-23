const {Schema, model} = require('mongoose');

const goalSchema = new Schema({
    phase: {type: Number},
    description: {type: String},
    meaningful: {type: Boolean},
    comments: {type:String},
    progress: {type:Number}
});

const jobSchema = new Schema({
    id: {type: Number},
    project_name: {type: String},
    price: {type: Number},
    costumer_id: {type: Number},
    deadline: {type: Date},
    // check if necessary
    customer_description: {type: String},
    goals: [{type: goalSchema}],
}, {collection: 'jobs'});

const job = model('job', jobSchema);

module.exports = job;
