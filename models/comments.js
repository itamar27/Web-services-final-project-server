const { Schema, model } = require('mongoose');

const commentsSchema = new Schema({
    customer_id: { type: Number },
    offer_id: { type: Number },
    comment: { type: String },
    active: { type: Boolean }

}, { collection: 'comments' });

const comments = model('comments', commentsSchema);

module.exports = comments;