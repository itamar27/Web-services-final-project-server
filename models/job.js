const {Schema} = require('mongoose');

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
    goals: [{type: goalSchema}],
}, {collection: 'jobs'});


module.exports = jobSchema;
