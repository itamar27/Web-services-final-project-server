const { FREELANCER, CUSTOMER } = require('../constants');
const Comments = require('../models/comments')
const { responseBadRequest, writeResponse } = require('./helper.ctrl');

const addComment = async (offer, userId) => {
    const comment = new Comments({
        customer_id: userId,
        offer_id: offer.project_id,
        comment: "",
        active: false
    })
    await comment.save()
        .then(() => { return })
        .catch(err => console.log(err))
}

const updateComments = async (userId, apiOffers) => {
    try {
        jobOffers = await Comments.find({ 'customer_id': userId });

        for (let j = 0; j < apiOffers.length; j++) {
            let notInList = true;
            for (let i = 0; i < jobOffers.length; i++) {
                if (jobOffers[i].offer_id == apiOffers[j].project_id)
                    notInList = false;
            }

            if (notInList) {
                try {
                    await addComment(apiOffers[j], userId);
                } catch (err) {
                    throw err;
                }
            }
        }
    } catch (err) {
        console.log(err);
    }

}


const getComments = async (userId) => {
    return await Comments.find({ 'customer_id': userId })
        .then((offers) => {
            return offers.filter(offer => offer.active == false);
        })
        .catch((err) => { throw err });
}

const updateComment = async (req, res) => {
    Comments.findOneAndUpdate({ "project_id": req.id }, { 'comment': req.body.comment }, { new: true, useFindAndModify: false })
        .then(docs => { res.json(docs) })
        .catch(err => writeResponse(req, res, `At: updateComments , error while updating comments: ${err}`));
}


module.exports = { getComments, addComment, updateComments, updateComment }