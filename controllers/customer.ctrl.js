const Customer = require('../models/customer');
const { getFreelancerApiId } = require('../controllers/freelancerApi.ctrl');
const { processBody, responseBadRequest, writeResponse } = require('./helper.ctrl');
const {CUSTOMER} = require('../constants');

const customerDbController = {

    getCustomers(req, res) {
        getAllCostumers()
            .then((ans) => {
                res.json(ans);
                writeResponse(req, res);
            })
            .catch(err => responseBadRequest(req, res, `Error getting data from DB: ${err}`));
    },

    async getCustomer(req, res) {
        let id = req.params.id;

        if (req.query.owner)
            id = await convertId(req.params.id);

        Customer.findOne({ "personal_details.id": id })
            .then(docs => {
                res.json(docs);
                writeResponse(req, res);
            })
            .catch(err => responseBadRequest(req, res, `At: getCostumer, error getting data from DB: ${err}`));
    },


    addCustomer(req, res) {
        Customer.findOne({}).sort({ _id: -1 }).limit(1)
            .then(async (lastCostumer) => {
                const freelancer_api_id =await  getFreelancerApiId(req.body.freelancer_api_name);
                console.log(freelancer_api_id);
                const newCustomer = new Customer({
                    'personal_details': {
                        'id': lastCostumer.personal_details.id + 1,
                        'first_name': req.body.firstName,
                        'last_name': req.body.lastName,
                        'email': req.body.email,
                        'linkedin': req.body.linkedin,
                        'facebook': req.body.facebook,

                    },
                    "freelancer_api_id": freelancer_api_id,
                    "freelancer_api_username":req.body.freelancer_api_name,
                    'jobs_id': []
                })

                newCustomer.save()
                    .then((response) => {
                        req.session.user = response;
                        req.session.user.role = CUSTOMER;
                        const user = {
                            first_name : req.session.user.personal_details.first_name,
                            last_name: req.session.user.personal_details.last_name,
                            email : req.session.user.personal_details.email,
                            role : req.session.user.role,
                        }
                        res.json(user);
                        writeResponse(req, res);
                    })
                    .catch((err) => { responseBadRequest(req, res, `Error saving a new customer + ${err}`); })
            }).catch((err) => { responseBadRequest(req, res, `Error finding last customer id + ${err}`); })

    },

    updateCustomer(req, res) {
        const update = processBody(req.body);

        updateCutomerHelper(req.params.id, update)
            .then((response) => {
                res.json(response);
                writeResponse(req, res);
            })
            .catch(err => responseBadRequest(req, res, `At: updateCustomer, error wehile updating customer: ${err}`));
    },

    deleteCustomer(req, res) {
        Customer.deleteOne({ "personal_details.id": req.params.id })
            .then(docs => res.json(docs))
            .catch(err => console.log(`Error deleting restaurant from db: ${err}`));
    },
};

// const helperAdding = (req,res) => {
//     Customer.findOne({}).sort({ _id: -1 }).limit(1)
//     .then(async (lastCostumer) => {
//         const freelancer_api_id = await getFreelancerApiId('ItaPita27');
//         const newCustomer = new Customer({
//             'personal_details': {
//                 'id': lastCostumer.personal_details.id + 1,
//                 'first_name': req.body.first_name,
//                 'last_name': req.body.last_name,
//                 'email': req.body.email,
//                 'address': req.body.address,
//                 'phone': req.body.phone,
//                 'linkedin': req.body.linkedin,
//                 'facebook': req.body.facebook,

//             },
//             "freelancer_api_id": freelancer_api_id,
//             "freelancer_api_username": req.body.freelancer_api_username,
//             'jobs_id': []
//         })

//         newCustomer.save()
//             .then((response) => {
//                 req.session.user = {
//                     'personal_details': {
//                         'id': lastCostumer.personal_details.id + 1,
//                         'first_name': req.body.first_name,
//                         'last_name': req.body.last_name,
//                         'email': req.body.email,
//                         'address': req.body.address,
//                         'phone': req.body.phone,
//                         'linkedin': req.body.linkedin,
//                         'facebook': req.body.facebook,

//                     },
//                     "freelancer_api_id": req.body.freelancer_api_id,
//                     "freelancer_api_username": req.body.freelancer_api_username,
//                     'jobs_id': []
//                 }
//                 res.json(req.session.user);
//                 writeResponse(req, res);
//             })
//             .catch((err) => { responseBadRequest(req, res, `Error saving a new customer + ${err}`); })
//     }).catch((err) => { responseBadRequest(req, res, `Error finding last customer id + ${err}`); })
// };

const convertId = (id) => {
    return Customer.findOne({ freelancer_api_id: id })
        .then(docs => { return docs.personal_details.id })
        .catch(err => writeResponse(req, res, `At: convertId, error getting data from DB: ${err}`));
};


const getAllCostumers = () => {
    return Customer.find({})
        .then(docs => { return docs })
        .catch(err => writeResponse(req, res, `At: getAllCostumers, error retreiving data from DB: ${err}`));
};


const updateCutomerHelper = (id, update) => {
    return Customer.findOneAndUpdate({ "personal_details.id": id }, update, { new: true, useFindAndModify: false })
        .then(docs => { return docs })
        .catch(err => writeResponse(req, res, `At: updateCutomerHelper , error wehile updating customer: ${err}`));
}



const writeCommentsBack = async (id, comments) => {
    try {
        await Customer.findOneAndUpdate({ "personal_details.id": id }, { "job_offers": comments }, { new: true, useFindAndModify: false })
    } catch (err) {
        writeResponse(req, res, `At: updateCutomerHelper , error wehile updating customer: ${err}`)
    }
}

const getCostumerByGoogle = async (id) => {
    try {
        let customer = await Customer.findOne({ "personal_details.google_id": id })
        return customer
    } catch (err) {
        console.log(err);
    }
}




module.exports = { updateCutomerHelper, getAllCostumers, convertId, getCostumerByGoogle, writeCommentsBack, customerDbController };