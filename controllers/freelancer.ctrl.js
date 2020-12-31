const freelancer = require('../models/freelancer');
const { processBody, responseBadRequest, writeResponse } = require('./helper.ctrl');

freeLancerDbController = {

    getFreelancers(req, res) {
        freelancer.find({})
            .then(docs => {
                res.json(docs);
                writeResponse(req, res, success);
            })
            .catch(err => responseBadRequest(req, res, `Error getting freelancers data from db: ${err}`));
    },

    getFreelancer(req, res) {
        freelancer.findOne({ "personal_details.id": req.params.id })
            .then(docs => {
                res.json(docs);
                writeResponse(req, res, success);
            })
            .catch(err => responseBadRequest(req, res, `Error getting freelancer data from db: ${err}`));
    },

    async addFreelancer(req, res) {
        freelancer.findOne({}).sort({ _id: -1 }).limit(1)
            .then(item => {
                let id = item.personal_details.id;
                const newFreelancer = new freelancer({
                    'personal_details': {
                        'id': id + 1,
                        'first_name': req.body.first_name,
                        'last_name': req.body.last_name,
                        'email': req.body.email,
                        'address': req.body.address,
                        'phone': req.body.phone,
                        'linkedin': req.body.linkedin,
                        'facebook': req.body.facebook
                    },
                    'skills': {
                        'work_experience': req.body.work_experience,
                        'work_history': req.body.work_history,
                        'programming_languages': req.body.work_fields,
                        'work_fields': req.body.work_fields // edit push
                    },
                    'jobs': [],
                });

                newFreelancer.save()
                    .then(response => {
                        res.json(response);
                        writeResponse(req, res, success);
                    })
                    .catch(err => { responseBadRequest(req, res, `Error saving a freelancer: + ${err}`) });
            })
            .catch(err => { responseBadRequest(req, res, `Error getting last freelancer id: + ${err}`) });

    },

    updateFreelancer(req, res) {
        const update = processBody(req.body);
        updateFreelancerHelper(req.params.id, update)
            .then((response) => {
                res.json(response);
                writeResponse(req, res, success);
            })
            .catch(err => responseBadRequest(req, res, `At: updateFreeLancer, error wehile updating freelancer: ${err}`));


        // freelancer.findOneAndUpdate({ "personal_details.id": req.params.id }, update, { new: true, useFindAndModify: false })
        //     .then(docs => { res.json(docs) })
        //     .catch(err => console.log(`At: updateFreeLancer, error ehile updating freelancer: ${err}`))
    },

    deleteFreelancer(req, res) {
        freelancer.deleteOne({ id: req.params.id })
            .then(docs => {
                res.json(docs);
                writeResponse(req, res, success);
            })
            .catch(err => responseBadRequest(req, res, `Error deleting freelancer from db: ${err}`));
    },

}


const updateFreelancerHelper = (id, update) => {
    return freelancer.findOneAndUpdate({ "personal_details.id": id }, update, { new: true, useFindAndModify: false })
        .then(docs => { return docs })
        .catch(err => writeResponse(req, res, `At: updateFreelancerHelper, error wehile updating freelancer: ${err}`));
}

module.exports = { updateFreelancerHelper, freeLancerDbController }