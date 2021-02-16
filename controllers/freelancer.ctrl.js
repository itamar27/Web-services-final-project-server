const Freelancer = require('../models/freelancer');
const { processBody, responseBadRequest, writeResponse } = require('./helper.ctrl');
const { FREELANCER } = require('../constants');


freeLancerDbController = {

    getFreelancers(req, res) {
        Freelancer.find({})
            .then(docs => {
                res.json(docs);
                writeResponse(req, res);
            })
            .catch(err => responseBadRequest(req, res, `Error getting freelancers data from db: ${err}`));
    },

    getFreelancer(req, res) {
        Freelancer.findOne({ "personal_details.id": req.params.id })
            .then(docs => {
                res.json(docs);
                writeResponse(req, res);
            })
            .catch(err => responseBadRequest(req, res, `Error getting freelancer data from db: ${err}`));
    },

    async addFreelancer(req, res) {
        let lastId = 0;
        try {
            lastFreelancer = await Freelancer.findOne({}).sort({ _id: -1 }).limit(1)
            lastId = lastFreelancer.personal_details.id;
        } catch (err) {
            //   handle later
        }
      
        let newFreelancer;
        try {

            newFreelancer = new Freelancer({
                'personal_details': {
                    'id': lastId + 1,
                    'google_id': req.body.google_id,
                    'first_name': req.body.firstName,
                    'last_name': req.body.lastName,
                    'email': req.body.email,
                    'linkedin': req.body.linkedin,
                    'facebook': req.body.facebook,
                },
                'description': req.body.freelancer.description,
                'skills': {
                    'work_experience': req.body.freelancer.workExperience,
                    'programming_languages': req.body.freelancer.programming,
                    'work_fields': req.body.freelancer.workFields
                },
                ' jobs_id': [],
            });


        } catch (err) {
            responseBadRequest(req, res, `Error getting last freelancer id: + ${err}`)
        }

        if (newFreelancer) {
            newFreelancer.save()
                .then(response => {
                    req.session.user = response;
                    req.session.role = FREELANCER;
                    const user = {
                        id: req.session.user.personal_details.id,
                        first_name: req.session.user.personal_details.first_name,
                        last_name: req.session.user.personal_details.last_name,
                        email: req.session.user.personal_details.email,
                        role: req.session.role,
                        apiName: req.session.user.freelancer_api_username,

                    }
                    const url = '/job_offers';
                    res.json({ user: user, url: url });
                    writeResponse(req, res);
                })
                .catch(err => { responseBadRequest(req, res, `Error saving a freelancer: + ${err}`) });
        }
    },

    updateFreelancer(req, res) {
        const update = processBody(req.body);
        updateFreelancerHelper(req.params.id, update)
            .then((response) => {
                res.json(response);
                writeResponse(req, res);
            })
            .catch(err => responseBadRequest(req, res, `At: updateFreeLancer, error wehile updating freelancer: ${err}`));
    },

    deleteFreelancer(req, res) {
        Freelancer.deleteOne({ id: req.params.id })
            .then(docs => {
                res.json(docs);
                writeResponse(req, res);
            })
            .catch(err => responseBadRequest(req, res, `Error deleting freelancer from db: ${err}`));
    },

}


const updateFreelancerHelper = (id, update) => {
    return Freelancer.findOneAndUpdate({ "personal_details.id": id }, update, { new: true, useFindAndModify: false })
        .then(docs => { return docs })
        .catch(err => writeResponse(req, res, `At: updateFreelancerHelper, error while updating freelancer: ${err}`));
}

const getFreelancerByGoogle = async (id) => {
    try {
        let freelancer = await Freelancer.findOne({ "personal_details.google_id": id })
        return freelancer
    } catch (err) {
        console.log(err);
    }
}


module.exports = { updateFreelancerHelper, getFreelancerByGoogle, freeLancerDbController }