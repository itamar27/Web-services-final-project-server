const Job = require('../models/job');
const { getLocalId } = require('../controllers/customer.ctrl');

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
        const data = req.body;

        Job.findOne({}).sort({ _id: -1 }).limit(1)
            .then((lastId) => {
                getLocalId(4668)            // need to update
                    .then((localId) => {
                        const newJob = new Job({
                            "id": lastId.id + 1,
                            "project_name": data.project_name,
                            "price": data.price,
                            "costumer_id": localId.personal_details.id,
                            "deadline": data.deadline,
                            "goals": data.goals
                        });

                        newJob.save().then((result) => { res.json(result); })
                            .catch((error) => { res.status(404).send("Error saving a new job"); })
                    }).catch((error) => { res.status(404).send("Error gettin local id"); });
            }).catch((error) => { res.status(404).send("Error getting last job id"); });

    },

    updateJob(req, res) {

    },

    deleteJob(req, res) {
        Job.deleteOne({ id: req.body.id })
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error deleting job from db: ${err}`));
    },

}
