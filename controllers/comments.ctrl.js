const { FREELANCER, CUSTOMER } = require('../constants');
const Comments = require('../models/comments')
const { responseBadRequest, writeResponse } = require('./helper.ctrl');


const addComment = async (offer, userId) => {
    const comment = new Comments({
        cutomer_id: userId,
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
        jobOffers = await Comments.find({ 'cutomer_id': userId });

        // console.log(jobOffers);
        // console.log(apiOffers);

        for (let j = 0; j < apiOffers.length; j++) {
            let notInList = true;

            for (let i = 0; i < jobOffers.length; i++)
                if (jobOffers[i].offer_id == apiOffers[j].project_id)
                    notInList = false;

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
    return await Comments.find({ 'cutomer_id': userId })
        .then((offers) => {
            return offers.filter(offer => offer.active == false);
        })
        .catch((err) => { throw err });
}

module.exports = { getComments, addComment, updateComments }