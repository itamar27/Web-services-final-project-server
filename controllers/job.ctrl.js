const Job = require('../models/job');
const { processBody, responseBadRequest, writeResponse } = require('./helper.ctrl');
const { convertId, updateCustomerHelper } = require('./customer.ctrl');
const { updateFreelancerHelper } = require('./freelancer.ctrl');
const { updateCommentStatus } = require('./comments.ctrl');
const moment = require('moment');



exports.jobDbController = {

    async getJobs(req, res) {
        // req.session.user = req.user

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
                            "description": req.body.description,
                            "project_name": req.body.project_name,
                            "price": req.body.price,
                            "start_date": moment().format('MM/DD/YYYY'),
                            "customer_id": serverId,
                            "deadline": req.body.deadline,
                            "goals": req.body.goals
                        });
                        newJob.save()
                            .then((result) => {

                                updateFreelancerHelper(req.session.user.personal_details.id, { "$push": { "jobs_id": result.id } })
                                    .then(() => {
                                        updateCustomerHelper(result.customer_id, { "$push": { "jobs_id": result.id } })
                                            .then(() => {
                                                updateCommentStatus(req, res, req.body.projectId, true);
                                                res.json(result.id);
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


    updateJob(req, res) {
        const update = req.body.job
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