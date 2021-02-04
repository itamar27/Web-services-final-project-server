const Job = require('../models/job');
const { processBody, responseBadRequest, writeResponse } = require('./helper.ctrl');
const { convertId, updateCutomerHelper } = require('./customer.ctrl');
const { updateFreelancerHelper } = require('./freelancer.ctrl');


exports.jobDbController = {

    async getJobs(req, res) {
        req.session.user = req.user

        Job.find({})
            .then(docs => {
                res.json(docs);
                writeResponse(req, res);
            })
            .catch(err => responseBadRequest(req, res, `Error getting jobs data from db: ${err}`));
    },

    getJob(req, res) {
        Job.findOne({ id: req.params.id })
            .then(docs => {
                res.json(docs);
                writeResponse(req, res);
            })
            .catch(err => responseBadRequest(req, res, `At: getJob, Error getting data from db: ${err}`));
    },

    async addJob(req, res) {

        Job.findOne({}).sort({ _id: -1 }).limit(1)
            .then((lastJob) => {
                convertId(req.body.owner_id)
                    .then((serverId) => {
                        const newJob = new Job({
                            "id": lastJob.id + 1,
                            "project_name": req.body.project_name,
                            "price": req.body.price,
                            "start_date": req.body.start_date,
                            "customer_id": serverId,
                            "deadline": req.body.deadline,
                            "goals": req.body.goals
                        });

                        newJob.save()
                            .then((result) => {
                                updateFreelancerHelper(req.body.freelancer_id, { "$push": { "jobs_id": result.id } })
                                    .then(() => {
                                        updateCutomerHelper(result.customer_id, { "$push": { "jobs_id": result.id } })
                                            .then(() => {
                                                res.json(result);
                                                writeResponse(req, res);
                                            })
                                            .catch(err => { responseBadRequest(req, res, `At: addJob, error updating customer: ${err}`); });
                                    })
                                    .catch(err => { responseBadRequest(req, res, `At: addJob, error updating freelancer: ${err}`); });
                            })
                            .catch((err) => { responseBadRequest(req, res, `At: addJob, error saving a new job: ${err}`); });
                    })
                    .catch((err) => { responseBadRequest(req, res, `At: addJob, error getting server id for costumer: ${err}`); });
            })
            .catch((err) => { responseBadRequest(req, res, `At: addJob, error getting last job id: ${err}`); });
    },

    // async addJob(req, res) {
    //     Job.findOne({}).sort({ _id: -1 }).limit(1)
    //         .then((lastJob) => {
    //             convertId(req.body.owner_id)
    //                 .then((serverId) => {
    //                     const newJob = new Job({
    //                         "id": lastJob.id + 1,
    //                         "project_name": req.body.project_name,
    //                         "price": req.body.price,
    //                         "start_date": req.body.start_date,
    //                         "customer_id": serverId,
    //                         "deadline": req.body.deadline,
    //                         "goals": req.body.goals
    //                     });

    //                     newJob.save()
    //                         .then((result) => {
    //                             updateFreelancerHelper(req.body.freelancer_id, { "$push": { "jobs_id": result.id } })
    //                                 .then(() => {
    //                                     updateCutomerHelper(result.customer_id, { "$push": { "jobs_id": result.id } })
    //                                         .then(() => {
    //                                             res.json(result);
    //                                             writeResponse(req, res);
    //                                         })
    //                                         .catch(err => { responseBadRequest(req, res, `At: addJob, error updating customer: ${err}`); });
    //                                 })
    //                                 .catch(err => { responseBadRequest(req, res, `At: addJob, error updating freelancer: ${err}`); });
    //                         })
    //                         .catch((err) => { responseBadRequest(req, res, `At: addJob, error saving a new job: ${err}`); });
    //                 })
    //                 .catch((err) => { responseBadRequest(req, res, `At: addJob, error getting server id for costumer: ${err}`); });
    //         })
    //         .catch((err) => { responseBadRequest(req, res, `At: addJob, error getting last job id: ${err}`); });
    // },

    updateJob(req, res) {
        const update = processBody(req.body);

        Job.findOneAndUpdate({ id: req.params.id }, update, { new: true, useFindAndModify: false })
            .then(docs => {
                res.json(docs);
                writeResponse(req, res);
            })
            .catch(err => responseBadRequest(req, res, `Error updating job from db: ${err}`));
    },

    deleteJob(req, res) {
        Job.deleteOne({ id: req.body.id })
            .then(docs => {
                res.json(docs);
                writeResponse(req, res);
            })
            .catch(err => responseBadRequest(req, res, `Error deleting job from db: ${err}`));
    },

}