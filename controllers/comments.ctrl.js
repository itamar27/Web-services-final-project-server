
const Comments = require('../models/comments')
const { writeResponse } = require('./helper.ctrl');

const addComment = async (offer, userId) => {
    const comment = new Comments({
        customer_id: userId,
        offer_id: offer.project_id,
        comment: "",
        active: false
    })
    await comment.save()
        .then(() => { return })
        .catch(err => { throw err })
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
                    if (userId)
                        await addComment(apiOffers[j], userId);
                } catch (err) {
                    throw err;
                }
            }
        }
    } catch (err) {
        throw err;
    }

}

const updateAllComments = async (jobs, customersId) => {
    try {
        for (let i = 0; i < customersId.length; i++) {
            const userJobs = jobs.filter((job) => job.owner_id === customersId[i].freelancer_api_id);
            await updateComments(customersId[i].personal_details.id, userJobs);
        }

    } catch (err) {
        throw err;
    }

}

const getAllComments = async () => {
    return await Comments.find({})
        .then((offers) => {
            return offers.filter(offer => offer.active == false);
        })
        .catch((err) => { throw err });
}


const getComments = async (userId) => {
    return await Comments.find({ 'customer_id': userId })
        .then((offers) => {
            return offers.filter(offer => offer.active == false);
        })
        .catch((err) => { throw err });
}

const updateComment = async (req, res) => {
    Comments.findOneAndUpdate({ "offer_id": req.params.id }, { 'comment': req.body.comment }, { new: true, useFindAndModify: false })
        .then(docs => { res.json(docs) })
        .catch(err => writeResponse(req, res, `At: updateComments , error while updating comments: ${err}`));
}

const updateCommentStatus = (req, res, projectId, update) => {
    Comments.findOneAndUpdate({ "offer_id": projectId }, { 'active': update }, { new: true, useFindAndModify: false })
        .then(docs => { return; })
        .catch(err => writeResponse(req, res, `At: updateComments , error while updating comments: ${err}`));
}




module.exports = { updateCommentStatus, getComments, addComment, updateComments, updateComment, getAllComments, updateAllComments }