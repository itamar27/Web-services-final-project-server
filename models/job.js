const {Schema, model} = require('mongoose');

const goalSchema = new Schema({
    phase: {type: Number},
    name: {type: String},
    description: {type: String},
    meaningful: {type: Boolean},
    comments: {type:String, default:null},
    progress: {type:Number, default:0}
});

const jobSchema = new Schema({
    id: {type: Number},
    project_name: {type: String},
    price: {type: String},
    customer_id: {type: Number},
    startDate : {type: Date},
    deadline: {type: Date},
    goals: [{type: goalSchema}],
}, {collection: 'jobs'});


const job = model('job', jobSchema);
module.exports = job;
