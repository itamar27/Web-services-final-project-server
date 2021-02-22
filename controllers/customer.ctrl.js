const Customer = require('../models/customer');
const { processBody, responseBadRequest, writeResponse, getFreelancerApiId } = require('./helper.ctrl');
const { CUSTOMER } = require('../constants');



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


    async addCustomer(req, res) {
        let lastId = 0;
        try {
            lastCostumer = await Customer.findOne({}).sort({ _id: -1 }).limit(1);
            lastId = lastCostumer.personal_details.id;
        } catch (err) {

            console.log(err);
        }

        let newCustomer;
        try {
            const freelancer_api_id = await getFreelancerApiId(req.body.freelancer_api_name);
            newCustomer = new Customer({
                'personal_details': {
                    'id': lastId + 1,
                    'google_id': req.body.google_id,
                    'first_name': req.body.firstName,
                    'last_name': req.body.lastName,
                    'email': req.body.email,
                    'linkedin': req.body.linkedin,
                    'facebook': req.body.facebook,

                },
                "freelancer_api_id": freelancer_api_id,
                "freelancer_api_username": req.body.freelancer_api_name,
                'jobs_id': []
            })
        } catch (err) {
            responseBadRequest(req, res, `Error saving a new customer + ${err}`);
        }

        if (newCustomer) {
            newCustomer.save()
                .then((response) => {
                    req.session.user = response;
                    req.session.role = CUSTOMER;
                    const user = {
                        id: req.session.user.personal_details.id,
                        first_name: req.session.user.personal_details.first_name,
                        last_name: req.session.user.personal_details.last_name,
                        email: req.session.user.personal_details.email,
                        role: req.session.role,
                        apiName: req.session.user.freelancer_api_username,

                    }
                    const url = `/user/${user.first_name}_${user.last_name}`

                    console.log('siginig up customer:');
                    console.log(req.session.user);


                    res.json({ user: user, url: url });
                    writeResponse(req, res);
                })
                .catch((err) => { responseBadRequest(req, res, `Error saving a new customer + ${err}`); })
        }


    },

    updateCustomer(req, res) {
        const update = processBody(req.body);

        updateCustomerHelper(req.params.id, update)
            .then((response) => {
                res.json(response);
                writeResponse(req, res);
            })
            .catch(err => responseBadRequest(req, res, `At: updateCustomer, error while updating customer: ${err}`));
    },

    deleteCustomer(req, res) {
        Customer.deleteOne({ "personal_details.id": req.params.id })
            .then(docs => res.json(docs))
            .catch(err => console.log(`Error deleting restaurant from db: ${err}`));
    },
};

const convertId = (id) => {
    return Customer.findOne({ freelancer_api_id: id })
        .then(docs => { return docs.personal_details.id })
        .catch(err => writeResponse(req, res, `At: convertId, error getting data from DB: ${err}`));
};


const getAllCustomers = (req, res) => {
    return Customer.find({})
        .then(docs => { return docs })
        .catch(err => writeResponse(req, res, `At: getAllCostumers, error retrieving data from DB: ${err}`));
};


const updateCustomerHelper = (id, update) => {
    return Customer.findOneAndUpdate({ "personal_details.id": id }, update, { new: true, useFindAndModify: false })
        .then(docs => { return docs })
        .catch(err => writeResponse(req, res, `At: updateCustomerHelper , error while updating customer: ${err}`));
}


const getCustomerByGoogle = async (id) => {
    try {
        let customer = await Customer.findOne({ "personal_details.google_id": id })
        return customer
    } catch (err) {
        console.log(err);
    }
}




module.exports = { updateCustomerHelper, getAllCustomers, convertId, getCustomerByGoogle, customerDbController };