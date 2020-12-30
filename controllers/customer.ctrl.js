const Customer = require('../models/customer');
const { processBody } = require('./helper.ctrl');
const {writeLog} = require('../logs/logs');

const customerDbController = {

    getCustomers(req, res) {
        getAllCostumers()
            .then((ans) => { res.json(ans) })
            .catch(err => console.log(`Error getting data from DB: ${err}`))
            .finally(() => {writeLog(req,res);})
    },

    async getCustomer(req, res) {
        let id = req.params.id;

        if (req.query.owner)
            id = await convertId(req.params.id);

        Customer.findOne({ "personal_details.id": id })
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`At: getCostumer, error getting data from DB: ${err}`))
            .finally(() => {writeLog(req,res);})
    },

    addCustomer(req, res) {
        Customer.findOne({}).sort({ _id: -1 }).limit(1)
            .then((lastCostumer) => {

                const newCustomer = new Customer({
                    'personal_details': {
                        'id': lastCostumer.personal_details.id + 1,
                        'first_name': req.body.first_name,
                        'last_name': req.body.last_name,
                        'email': req.body.email,
                        'address': req.body.address,
                        'phone': req.body.phone,
                        'linkedin': req.body.linkedin,
                        'facebook': req.body.facebook,

                    },
                    "freelancer_api_id": req.body.freelancer_api_id,
                    "freelancer_api_username": req.body.freelancer_api_username,
                    'jobs_id': []
                })

                newCustomer.save()
                    .then((response) => { res.json(response); })
                    .catch((err) => { res.status(404).send(`Error saving a new customer + ${err}`); })
            }).catch((err) => { res.status(404).send("Error finding last customer id"); })

    },

    updateCustomer(req, res) {
        const update = processBody(req.body);

        updateCutomerHelper(req.params.id, update)
            .then((response) => res.json(response))
            .catch(err => console.log(`At: updateCustomer, error wehile updating customer: ${err}`));            
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
        .catch(err => console.log(`At: convertId, error getting data from DB: ${err}`));
};


const getAllCostumers = () => {
    return Customer.find({})
        .then(docs => { return docs })
        .catch(err => console.log(`At: getAllCostumers, error retreiving data from DB: ${err}`));
};


const updateCutomerHelper = (id,update) => {
    return Customer.findOneAndUpdate({ "personal_details.id": id }, update, { new: true, useFindAndModify: false })
    .then(docs => { return docs })
    .catch(err => console.log(`At: updateCutomerHelper , error wehile updating customer: ${err}`))
}
 

module.exports = { updateCutomerHelper, getAllCostumers, convertId, customerDbController };


