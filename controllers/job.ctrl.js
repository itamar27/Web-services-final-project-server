const Job = require('../models/job');

exports.jobDbController = {
  
    getJobs(req, res) {
        Job.find({})
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error getting jobs data from db: ${err}`));
    },

    getJob(req, res) {
        Job.findOne({ id: req.params.id })
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error getting job data from db: ${err}`));
    }, 

    async addJob(req, res) {
    },

    updateJob(req, res) {

    },

    deleteJob(req, res) {
        Job.deleteOne({ id: req.params.id })
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error deleting freelancer from db: ${err}`));
    },

}
