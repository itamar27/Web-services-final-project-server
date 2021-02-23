const Job = require('../models/job');
const { responseBadRequest, writeResponse } = require('./helper.ctrl');
const { convertId, updateCustomerHelper } = require('./customer.ctrl');
const { updateFreelancerHelper } = require('./freelancer.ctrl');
const { updateCommentStatus } = require('./comments.ctrl');
const moment = require('moment');



exports.jobDbController = {

    getJobs(req, res) {
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

    getCustomerJobs(req, res) {
        Job.find({ 'customer_id': req.params.id })
            .then(docs => {
                let returnedJobs = []
                docs.forEach(doc => {
                    const job = {
                        project_id: doc.id,
                        title: doc.project_name,
                        description: doc.description,
                        price: doc.price,
                        owner_id: doc.customer_id,
                    }
                    returnedJobs.push(job);
                })
                res.json(returnedJobs);
                writeResponse(req, res);
            })
            .catch(err => responseBadRequest(req, res, `Error getting jobs data from db: ${err}`));
    },


    async getFreelancerJobs(req, res) {
        const jobs = req.session.user.jobs_id
        let returnedJobs = [];

        try {
            for (let i = 0; i < jobs.length; i++) {
                const tmp = await Job.find({ 'id': jobs[i] });

                const job = {
                    project_id: tmp[0].id,
                    title: tmp[0].project_name,
                    description: tmp[0].description,
                    price: tmp[0].price,
                    owner_id: tmp[0].customer_id,
                }
                console.log(job);
                returnedJobs.push(job);
            }
        } catch (err) {
            responseBadRequest(req, res, `Error getting jobs data from db: ${err}`)
        }

        res.json(returnedJobs);
        writeResponse(req, res);
    },


    addJob(req, res) {
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


    updateJobGoals(req, res) {
        const update = req.body.goals
        Job.findOneAndUpdate({ id: req.params.id }, { 'goals': update }, { new: true, useFindAndModify: false })
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